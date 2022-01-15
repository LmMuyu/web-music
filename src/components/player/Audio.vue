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
          <el-col :span="15" class="flex self-center">
            <div class="flex items-center justify-center" style="flex: 1">
              <AudioAndVideoControls
                @next="controlsMethods.next"
                @pre="controlsMethods.pre"
                @play="controlsMethods.play"
                @pause="controlsMethods._pause"
              ></AudioAndVideoControls>
            </div>
            <div style="flex: 2">
              <PlayMusicTime
                :starttime="starttime"
                :maxtime="playHowl.dt"
                class="w-full items-baseline"
              >
                <PlaySlider v-model="starttime" :max="playHowl.dt" />
              </PlayMusicTime>
            </div>
          </el-col>
          <el-col :span="1" class="flex flex-col">
            <div  v-show="showSlider" class="relative flex justify-center audio_slider clearfolat">
              <el-slider
                class="absolute left-0 -top-10"
                v-model="volume"
                :vertical="true"
                height="80px"
                @mouseenter="enterEvent"
              >
              </el-slider>
            </div>
            <volume-icon @click.captrue="showSlider = !showSlider" :volume="volume"></volume-icon>
          </el-col>
          <el-col :span="1" class="flex items-center justify-center">
            <div @click="openRightDrawer" class="flex items-center">
              <font-icon icon="iconindent" size="24"></font-icon>
            </div>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue-demi";

import Howl from "./play";
import { musicDetail } from "../../utils/musicDetail";
import { openDrawer } from "../../layout/playlist/components/PlayListHistory";

//@ts-ignore
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";
import PlaySlider from "../../components/slider/Slider.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue";
import VolumeIcon from "./components/VolumeIcon.vue";
import { ElSlider, ElRow, ElCol } from "element-plus";
import FontIcon from "../fonticon/FontIcon.vue";
import { debounce } from "../../utils/debounce";

const starttime = ref(0);
const volume = ref(0);
const historyData = ref([]);
const musicHowler = new Howl();
const musicinfo = ref<musicDetail>();
const showSlider = ref(false);
let isenterSlider = false;

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
      starttime.value = curtime;
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

function replaceMethods(methods: Record<string, Function>, howler: Howl) {
  ["play", "_pause", "next", "pre"].map((mdsname) => {
    const newBindFn: Function = howler[mdsname].bind(howler);
    const proxyFn = new Proxy(newBindFn, handler());
    methods[mdsname] = proxyFn;

    return proxyFn;
  });
}

const openRightDrawer = () => openDrawer(historyData);

const enterEvent = debounce(cursourEnterSlider);

function cursourEnterSlider(e) {
  if (isenterSlider) {
    e.stopPropagation();
    e.preventDefault();
  }

  isenterSlider = true;
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
    height:80px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4px;
  `;

    sliderBar.style.cssText = `
    height: 100%;
    width: inherit;
  `;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  playHowl.playid = id;

  nextTick(() => {
    sliderstyle();

    document.documentElement.addEventListener("click", () => {
      if (isenterSlider) {
        showSlider.value = false;
        isenterSlider = false;
      }
    });
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

.clearfolat {
  &::before,
  &::after {
    content: "";
    display: block;
  }

  &::after {
    clear: both;
  }
}
</style>
