<template>
  <div class="flex items-center relative h-full w-full px-4 audio_shadow">
    <div class="flex"><AudioSongInfoShow /></div>
    <el-row class="flex content-center h-full w-full">
      <el-col :span="4" class="flex items-center justify-center">
        <AudioAndVideoControls :status="isplay" @play="play" @pause="pause"></AudioAndVideoControls>
      </el-col>
      <el-col :span="14" class="flex self-center h-full">
        <PlayMusicTime :starttime="musicPosTime * 1000" :maxtime="maxTime" class="w-full">
          <AudioSlider
            :starttime="musicPosTime * 1000"
            :mintime="0"
            :maxtime="maxTime"
            @input="inputValue"
          />
        </PlayMusicTime>
      </el-col>
      <el-col :span="6" class="flex items-center">
        <div class="flex px-4">
          <volume-icon @click.captrue="showSlider = !showSlider" :volume="volume"></volume-icon>
          <div v-if="showSlider" class="w-full audio_slider">
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
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, nextTick, toRef, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue-demi";

import { musicDetail } from "../../utils/musicDetail";
import { openDrawer } from "../../layout/playlist/components/PlayListHistory";
import { debounce } from "../../utils/debounce";
import { commentMusic, getMusicDetail } from "../../api/playList";
import AudioHow from "./Howler";

//@ts-ignore
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";
import AudioSongInfoShow from "./components/AudioSongInfoShow.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue";
import AudioSlider from "./components/AudioSlider.vue";
import { ElSlider, ElRow, ElCol } from "element-plus";
import VolumeIcon from "./components/VolumeIcon.vue";
import FontIcon from "../fonticon/FontIcon.vue";

const id = useRoute().query.id as unknown as number;

let isclick = true;
let currPage = 1;
const initTime = ref(0);
const volume = ref(0);
const historyData = ref([]);
const musicinfo = ref<musicDetail>();
const showSlider = ref(false);
const maxTime = ref(0);
const comments = ref([]);
const COMMENT_LEN = 40;
const MAX_LIMIT = COMMENT_LEN;
const timeTable = new Map();
const playListHistoryOptions = reactive({ total: 0, time: 0 });

const {
  isplay,
  pause,
  stop,
  play,
  seek: setseek,
  playSeek: seekTime,
} = AudioHow(id, [], {
  currentIndexBackFn: currentMusicPlayIndex,
});

let musicPosTime = seekTime();

function setTimeTable(page: number, time: number) {
  if (!timeTable.has(page)) {
    timeTable.set(page, time);
  }
}

function inputValue(pos: number) {
  musicPosTime.value = pos / 1000;
  setseek(pos);
}

getMusicDetail(String(id)).then(({ data }) => {
  const songdetail = data.songs[0];
  maxTime.value = songdetail.dt;
});

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

commentMusic(id, 1, 0, MAX_LIMIT).then(commentMusicThenFn);

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

onMounted(() => {
  nextTick(() => {
    sliderstyle();
    document.documentElement.addEventListener("click", windowClick, false);
  });
});

onUnmounted(() => {
  document.documentElement.removeEventListener("click", windowClick, false);
});

defineExpose({
  musicinfo,
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
</style>
