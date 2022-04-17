<template>
  <transition name="fide">
    <div
      @mouseenter="enterAudio"
      @mouseleave="leaveAudio"
      class="flex items-center h-full w-full px-4 relative bg-white z-50 audio_shadow"
      v-show="!isLeaveSanSecBelow"
    >
      <el-row class="flex content-center h-full w-full">
        <el-col :span="4" class="flex"><AudioSongInfoShow :musicinfo="musicinfo" /></el-col>
        <el-col :span="4" class="flex items-center justify-center">
          <AudioAndVideoControls
            :status="isplay"
            @play="play"
            @pause="pause"
            @next="nextMusic"
            @pre="preveMusic"
          ></AudioAndVideoControls>
        </el-col>
        <el-col :span="12" class="flex self-center h-full">
          <PlayMusicTime :starttime="audioPlayTime" :maxtime="maxTime" class="w-full">
            <AudioSlider
              :starttime="audioPlayTime"
              :mintime="0"
              :maxtime="maxTime"
              @input="(pos) => inputValue(pos)"
            />
          </PlayMusicTime>
        </el-col>
        <el-col :span="4" class="flex items-center">
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
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";

import { openDrawer } from "../../layout/playlist/components/PlayListHistory";
import { commentMusic, getMusicDetail } from "../../api/playList";
import { useLocalStorage } from "../../utils/useLocalStorage";
import { musicDetail } from "../../utils/musicDetail";
import { debounce } from "../../utils/debounce";
import dexieFn from "../../common/dexie";
import { musicPlayEndZero, sliderstyle } from "./methods";
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

let mid = 0;
let isclick = true;
let currPage = 1;
const volume = ref(0);
const historyData = ref([]);
const showSlider = ref(false);
const comments = ref([]);
const COMMENT_LEN = 40;
const musicinfo = ref<musicDetail>();
const MAX_LIMIT = COMMENT_LEN;
const timeTable = new Map();
const playListHistoryOptions = reactive({ total: 0, time: 0 });
const islock = ref(false);
const ctx = getCurrentInstance();

const dexie = dexieFn();
const {
  isplay,
  pause,
  stop,
  play,
  maxTime,
  palylists,
  nextMusic,
  preveMusic,
  seek: setseek,
  setImmdPlayLists,
  initCurrentIndex,
  volume: setVolume,
  playSeek: seekTime,
} = AudioHow(
  {
    currentIndexBackFn: currentMusicPlayIndex,
    musicinfoRef: musicinfo,
  },
  getCurrentInstance()
);

const musicPosTime = seekTime();
volume.value = setVolume() * 100;
musicPlayEndZero(ctx, musicPosTime);

const audioPlayTime = computed(() => {
  const musicTime = Math.round(musicPosTime.value);
  return musicTime * 1000;
});

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

const openRightDrawer = () => openDrawer(historyData);

const mouseEvent = debounce(cursourEnterSlider);

function cursourEnterSlider(e: MouseEvent) {
  if (e.type === "mousedown") {
    isclick = false;
  } else {
    isclick = true;
  }
}

async function currentMusicPlayIndex(index: number, mid: number) {
  console.log(index);
  const data = await commentMusic(mid, 1, 0, MAX_LIMIT);

  if (data) {
    commentMusicThenFn(data);
  }
}

function currentChange(index: number) {
  if (index === currPage) {
    return;
  }
  commentMusic(mid, index, timeTable.get(index - 1)).then(commentMusicThenFn);
}

function changePageIndex(index: number) {
  if (index === currPage) {
    return;
  }

  commentMusic(mid, index, timeTable.get(index - 1) ?? 0).then(commentMusicThenFn);
}

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

function openCommentList() {
  openDrawer(comments, "评论", {
    "current-change": currentChange,
    "next-click": changePageIndex,
    "prev-click": changePageIndex,
    total: toRef(playListHistoryOptions, "total").value,
    size: MAX_LIMIT,
  });
}

function windowClick() {
  if (isclick && !showSlider.value) {
    showSlider.value = false;
  }
}

const storeMid = computed<number>(store.getters["playlist/getSongId"]);
watchEffect(async () => {
  try {
    if (storeMid.value && storeMid.value !== mid) {
      console.log(mid);

      mid = storeMid.value;
      const findIndex = palylists.value.findIndex((value) => value.id === mid);

      //点击播放，查询看一下有没有在播放在列表中，有就将它插入到列表最前
      if (findIndex > -1) {
        palylists.value.unshift(...palylists.value.splice(findIndex, 1));
        return;
      }

      const reqdata = await getMusicDetail(String(mid));
      if (reqdata.data.songs.length === 0) return;

      const song = reqdata.data.songs[0];
      const songInfo = new musicDetail(song);

      setImmdPlayLists(songInfo);
      Promise.resolve().then(() => store.commit("playlist/setSongInfo", songInfo));
      musicinfo.value = songInfo;

      enterAudioActive();
      leaveTimeout();

      (await dexie).put(songInfo.id, songInfo);
      setImmdPlayLists(songInfo);
      initCurrentIndex(songInfo);
      useLocalStorage("recplaysong", JSON.stringify(songInfo));
    }
  } catch (error) {
    console.log(error);
  }
});

//获取登录用户的播放队列
const musiclists = computed<musicDetail[]>(store.getters["playlist/getMusiclists"]);
watchEffect(() => {
  if (musiclists.value.length > 0) {
    palylists.value.length = 0;
    setImmdPlayLists(musiclists.value);
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
