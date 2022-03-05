<template>
  <transition name="fide">
    <div
      @mouseenter="enterAudio"
      @mouseleave="leaveAudio"
      v-show="!isLeaveSanSecBelow"
      class="flex items-center h-full w-full px-4 relative bg-white z-50 audio_shadow"
    >
      <div class="flex"><AudioSongInfoShow :musicinfo="musicinfo" /></div>
      <el-row class="flex content-center h-full w-full">
        <el-col :span="4" class="flex items-center justify-center">
          <AudioAndVideoControls
            :status="isplay"
            @play="play"
            @pause="pause"
          ></AudioAndVideoControls>
        </el-col>
        <el-col :span="14" class="flex self-center h-full">
          <PlayMusicTime :starttime="musicPosTime * 1000" :maxtime="maxTime" class="w-full">
            <AudioSlider
              :starttime="musicPosTime * 1000"
              :mintime="0"
              :maxtime="maxTime"
              @input="(pos) => inputValue(pos)"
            />
          </PlayMusicTime>
        </el-col>
        <el-col :span="6" class="flex items-center">
          <div class="flex px-4">
            <volume-icon :volume="volume"></volume-icon>
            <div v-show="showSlider" class="w-full audio_slider">
              <el-slider @mousemove="mouseEvent" @mouseleave="mouseEvent" v-model="volume">
              </el-slider>
            </div>
          </div>
          <div @click="openRightDrawer" class="flex items-center px-4">
            <font-icon icon="iconindent" size="24"></font-icon>
          </div>
          <div class="px-4">
            <font-icon @click.captrue="openCommentList" icon="iconpinglun_huabanfuben" size="24">
            </font-icon>
          </div>
          <div class="px-4">
            <font-icon
              @click.capture="onLock"
              :icon="islock ? 'iconsuoding_o' : 'iconjiesuo'"
              size="24"
            >
            </font-icon>
          </div>
        </el-col>
      </el-row>
    </div>
  </transition>
  <div
    v-if="isLeaveSanSecBelow"
    @mouseenter="enterAudio"
    class="w-full h-6 absolute bottom-0 left-0"
  ></div>
</template>
<script setup lang="ts">
import {
  reactive,
  ref,
  nextTick,
  toRef,
  onUnmounted,
  PropType,
  watchEffect,
  computed,
  onMounted,
} from "vue";
import { useStore } from "vuex";

import { openDrawer } from "../../layout/playlist/components/PlayListHistory";
import { commentMusic, getMusicDetail } from "../../api/playList";
import { useLocalStorage } from "../../utils/useLocalStorage";
import { musicDetail } from "../../utils/musicDetail";
import { debounce } from "../../utils/debounce";
import dexieFn from "../../common/dexie";
import AudioHow from "./Howler";

//@ts-ignore
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";
import AudioSongInfoShow from "./components/AudioSongInfoShow.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue";
import AudioSlider from "./components/AudioSlider.vue";
import { ElSlider, ElRow, ElCol } from "element-plus";
import VolumeIcon from "./components/VolumeIcon.vue";
import FontIcon from "../fonticon/FontIcon.vue";

const props = defineProps({
  songinfo: {
    type: Object as PropType<musicDetail>,
    required: true,
  },
});

const store = useStore();

let id = 0;
let isclick = true;
let currPage = 1;
const volume = ref(0);
const historyData = ref([]);
const showSlider = ref(false);
const maxTime = ref(0);
const comments = ref([]);
const COMMENT_LEN = 40;
const musicinfo = ref<musicDetail>();
const MAX_LIMIT = COMMENT_LEN;
const timeTable = new Map();
const playListHistoryOptions = reactive({ total: 0, time: 0 });
const islock = ref(false);

const songlists: musicDetail[] = [];

const dexie = dexieFn();

const {
  isplay,
  pause,
  stop,
  play,
  setPlayLists,
  initCurrentIndex,
  seek: setseek,
  volume: setVolume,
  playSeek: seekTime,
} = AudioHow(songlists, {
  currentIndexBackFn: currentMusicPlayIndex,
});

let musicPosTime = seekTime();
volume.value = setVolume() * 100;

let tiemr = null;
let isLeaveSanSecBelow = ref<null | boolean>(null);

function leaveTimeout() {
  tiemr = setTimeout(() => {
    isLeaveSanSecBelow.value = true;
  }, 3000);
}

function enterAudioActive() {
  isLeaveSanSecBelow.value = false;

  clearTimeout(tiemr);
  tiemr = null;
}

function enterAudio() {
  enterAudioActive();
}

function leaveAudio() {
  if (!islock.value) {
    leaveTimeout();
  }
}

function setTimeTable(page: number, time: number) {
  if (!timeTable.has(page)) {
    timeTable.set(page, time);
  }
}

function onLock() {
  islock.value = !islock.value;
}

function inputValue(pos: number) {
  musicPosTime.value = pos / 1000;
  setseek(pos);
}

async function indexDBAAllData() {
  const allCollectionData = await (await dexie).getAllSong();
  const data = allCollectionData.map((musicDetailData) => musicDetailData.songinfo);
  songlists.push(...data);

  setPlayLists(data);
  firstSongInfo();
}

async function firstSongInfo() {
  const songinfo = useLocalStorage("preSongInfo");

  if (!songinfo.value) {
    const songinfo = await (await dexie).first();
    if (!songinfo) return;

    musicinfo.value = songinfo.songinfo;
    useLocalStorage("preSongInfo", JSON.stringify(songinfo.songinfo));
  } else {
    const index = initCurrentIndex(JSON.parse(songinfo.value));
    musicinfo.value = songlists[index];
    maxTime.value = musicinfo.value.dt;
  }

  setPlayLists(musicinfo.value);
}

indexDBAAllData();

function commentMusicThenFn({ config, data: comment }) {
  playListHistoryOptions.total = comment.total;
  playListHistoryOptions.time = comment.comments[comment.comments.length - 1].time;

  if (config.params.offset + 1 === 1 && comment.hotComments.length > 0) {
    const diff = COMMENT_LEN - comment.hotComments.length;
    comments.value = [...comment.hotComments, ...comment.comments.slice(0, diff)];
    return;
  }

  comments.value = comment.comments;
  setTimeTable(1, playListHistoryOptions.time);
}

const openRightDrawer = () => openDrawer(historyData);

const mouseEvent = debounce(cursourEnterSlider);

function cursourEnterSlider(e: MouseEvent) {
  if (e.type === "mousedown") {
    isclick = false;
  } else {
    isclick = true;
  }
}

function currentMusicPlayIndex(index: number) {
  console.log(index);
}

async function sliderstyle() {
  try {
    const boxSlider = document.querySelector(".audio_slider");
    const sliderBtn = boxSlider.querySelector(".el-slider__button") as HTMLElement;
    const sliderRunway = boxSlider.querySelector(".el-slider__runway") as HTMLElement;
    const sliderBar = boxSlider.querySelector(".el-slider__bar") as HTMLElement;

    sliderBtn.style.cssText = `
      width:15px;
      height:15px;
     `;
    sliderRunway.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
      width: 100%;
    `;
    sliderBar.style.cssText = `
    height: 100%;
    width: inherit;
  `;
  } catch (error) {
    console.log(error);
  }
}

function currentChange(index: number) {
  if (index === currPage) {
    return;
  }
  commentMusic(id, index, timeTable.get(index - 1)).then(commentMusicThenFn);
}

function changePageIndex(index: number) {
  if (index === currPage) {
    return;
  }

  commentMusic(id, index, timeTable.get(index - 1) ?? 0).then(commentMusicThenFn);
}

function openCommentList() {
  openDrawer(comments, "评论", {
    "current-change": currentChange,
    "next-click": changePageIndex,
    "prev-click": changePageIndex,
    total: toRef(playListHistoryOptions, "total"),
    size: MAX_LIMIT,
  });
}

function windowClick() {
  if (isclick && !showSlider.value) {
    showSlider.value = false;
  }
}

const songId = computed<number>(store.getters["playlist/getSongId"]);

watchEffect(async () => {
  try {
    if (songId.value && songId.value !== id) {
      id = songId.value;
      const findIndex = songlists.findIndex((value) => value.id === id);

      if (findIndex > -1) {
        songlists.unshift(...songlists.splice(findIndex, 1));
      }

      const reqdata = await getMusicDetail(id);
      const song = reqdata.data.songs[0];
      const songInfo = new musicDetail(song);

      songlists.unshift(songInfo);
      Promise.resolve().then(() => store.commit("playlist/setSongInfo", songInfo));

      enterAudioActive();
      leaveTimeout();

      const data = await commentMusic(id, 1, 0, MAX_LIMIT);
      if (data) {
        commentMusicThenFn(data);
      }

      (await dexie).put(songInfo.id, songInfo);
      setPlayLists(songInfo);
      initCurrentIndex(songInfo);
      useLocalStorage("preSongInfo", JSON.stringify(songInfo));
    }
  } catch (error) {
    console.log(error);
  }
});

onMounted(() =>
  nextTick().then(() => {
    sliderstyle();
    leaveTimeout();
    document.documentElement.addEventListener("click", windowClick, false);
  })
);

onUnmounted(() => {
  document.documentElement.removeEventListener("click", windowClick, false);
});
</script>
<style scoped lang="scss">
@include Iconfont(#2d3436, 20);
.decoration {
  text-decoration: none !important;

  &:hover {
    text-decoration: underline !important;
  }
}

.audio_shadow {
  -webkit-box-shadow: 0px -1px 3px 0px rgba(245, 245, 245, 1);
  -moz-box-shadow: 0px -1px 3px 0px rgba(245, 245, 245, 1);
  box-shadow: 0px -1px 3px 0px rgba(245, 245, 245, 1);
}

.fide-leave-active {
  transition: all 0.45s ease-out;
}

.fide-enter-active {
  transition: all 0.25s ease-out;
}

.fide-leave-to,
.fide-enter-from {
  transform: translateY(48px);
}
</style>
