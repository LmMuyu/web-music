<template>
  <div class="flex items-center relative h-full w-full py-2 audio_shadow">
    <div class="flex items-center h-full w-full px-4">
      <div class="flex">
        <div style="width: 48px; height: 48px">
          <img
            class="object-cover"
            :src="musicinfo?.picUrl + '?param=48y48'"
            :alt="musicinfo?.name"
          />
        </div>
        <div>
          <div class="flex justify-center flex-col ml-4 truncate text-gray-700">
            <span :music-id="id" class="flex-1 cursor-pointer decoration">{{
              musicinfo?.name
            }}</span>
            <span class="text-sm flex-1 decoration" v-html="musicinfo?.nickName"></span>
          </div>
        </div>
      </div>
      <div class="flex flex-col h-full w-full">
        <el-row class="flex content-center h-full w-full">
          <el-col :span="18" class="flex self-center h-full">
            <div class="flex items-center justify-center" style="flex: 1">
              <AudioAndVideoControls
                @next="controlsMethods.next"
                @pre="controlsMethods.pre"
                @play="controlsMethods.play"
                @pause="controlsMethods._pause"
              ></AudioAndVideoControls>
            </div>
            <div style="flex: 2">
              <PlayMusicTime :starttime="starttime" :maxtime="playHowl.dt" class="w-full">
                <PlaySlider v-model="starttime" :max="playHowl.dt" />
              </PlayMusicTime>
            </div>
          </el-col>
          <el-col :span="1" class="flex items-center">
            <div>
              <volume-icon @click.captrue="showSlider = !showSlider" :volume="volume"></volume-icon>
            </div>
          </el-col>
          <el-col v-show="showSlider" :span="2" class="h-full flex items-center justify-center">
            <div class="w-full audio_slider">
              <el-slider @mousemove="mouseEvent" @mouseleave="mouseEvent" v-model="volume">
              </el-slider>
            </div>
          </el-col>
          <el-col :span="1" class="flex items-center justify-center">
            <div @click="openRightDrawer" class="flex items-center">
              <font-icon icon="iconindent" size="24"></font-icon>
            </div>
          </el-col>
          <el-col :span="1" class="flex items-center justify-center">
            <font-icon @click.captrue="openCommentList" icon="iconpinglun_huabanfuben" size="24">
            </font-icon>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, nextTick, toRef } from "vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue-demi";

import Howl from "./play";
import { musicDetail } from "../../utils/musicDetail";
import { openDrawer } from "../../layout/playlist/components/PlayListHistory";
import { debounce } from "../../utils/debounce";
import { commentMusic } from "../../api/playList";

//@ts-ignore
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";
import PlaySlider from "../../components/slider/Slider.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue";
import VolumeIcon from "./components/VolumeIcon.vue";
import { ElSlider, ElRow, ElCol } from "element-plus";
import FontIcon from "../fonticon/FontIcon.vue";

const starttime = ref(0);
const volume = ref(0);
const historyData = ref([]);
const musicHowler = new Howl();
const musicinfo = ref<musicDetail>();
const showSlider = ref(false);
const comments = ref([]);
const COMMENT_LEN = 40;
let isclick = true;
let currPage = 1;
const MAX_LIMIT = COMMENT_LEN;
const playListHistoryOptions = reactive({
  total: 0,
  time: 0,
});
const timeTable = new Map();

const controlsMethods = reactive({
  pre: () => {},
  play: () => {},
  _pause: () => {},
  next: () => {},
});

const id = useRoute().query.id as unknown as number;
volume.value = musicHowler.play_volume * 100;

const playHowl = new Proxy(musicHowler, {
  set(target, key, value) {
    (async function () {
      if (key === "playid") {
        const data = await target.getMusicDeatils(value);
        replaceMethods(controlsMethods, target);

        musicinfo.value = data.musicinfo;
        historyData.value.unshift(data.musicinfo);
      }
    })();

    return true;
  },
});

function interceptFnApply(Fn: Function) {
  if (Fn.name.indexOf("play") > 0) {
    playHowl._seek(function (curtime) {
      starttime.value = curtime * 1000;
    });
  }
}

function handler<T extends Function>(): ProxyHandler<any> {
  return {
    apply(target: T, thisarg: any, args: any) {
      target.call(playHowl);
      interceptFnApply(target);
    },
  };
}

function setTimeTable(page: number, time: number) {
  if (!timeTable.has(page)) {
    timeTable.set(page, time);
  }
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

commentMusic(id, 1, 0, MAX_LIMIT).then(commentMusicThenFn);

function replaceMethods(methods: Record<string, Function>, howler: Howl) {
  ["play", "_pause", "next", "pre"].map((mdsname) => {
    const newBindFn: Function = howler[mdsname].bind(howler);
    const proxyFn = new Proxy(newBindFn, handler());
    methods[mdsname] = proxyFn;

    return proxyFn;
  });
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

onMounted(() => {
  console.log(id);

  playHowl.playid = id;

  nextTick(() => {
    sliderstyle();

    document.documentElement.addEventListener(
      "click",
      () => {
        console.log(showSlider.value);

        if (isclick && !showSlider.value) {
          showSlider.value = false;
        }
      },
      false
    );
  });
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
