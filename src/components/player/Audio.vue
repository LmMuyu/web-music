<template>
  <div class="flex items-center h-full">
    <AudioAndVideoControls
      :playStatus="playStatus"
      @play="audioPlay"
    ></AudioAndVideoControls>
    <div class="px-2">
      <img
        class="object-contain"
        :src="musicImage + '?param=45y45'"
        :alt="musicName"
      />
    </div>
    <div class="flex flex-col flex-1 mx-4">
      <div class="flex justify-between">
        <p class="py-2 text-gray-700">{{ musicName }}</p>
        <div class="flex items-center">
          <div class="px-1">
            <CalculationTime :time="currentTime"></CalculationTime>
          </div>
          <span class="px-1">/</span>
          <span class="px-1">
            <CalculationTime :time="sliderMax"></CalculationTime>
          </span>
        </div>
      </div>
      <div class="py-2">
        <Slider
          v-model="currentTime"
          :max="sliderMax"
          :background="background"
        ></Slider>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, watch, defineEmit } from "vue";
import { onBeforeRouteLeave } from "vue-router";

//@ts-ignore
import Slider from "/comps/slider/Slider.vue";
import CalculationTime from "./components/CalculationTime.vue";
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";

import { promptbox } from "../../components/promptBox";
import { status } from "./hook/data";

import type { Ref } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  musicImage: {
    type: String,
    default: "",
  },
  musicName: {
    type: String,
    default: "",
  },
  background: {
    type: String,
    default: "red",
  },
  playStatus: {
    type: Object,
    default: () => {},
  },
});

const emitCtx = defineEmit(["currPlayTime"]);

const currentTime = ref(0);
const sliderMax = ref(0);
const musicStatus = ref(true);
let Audio: null | HTMLAudioElement = null;

function audioPlay(status: Ref<boolean>) {
  musicStatus.value = status.value;

  status.value ? Audio?.pause() : Audio?.play();
}

function timeupdate(Audio: HTMLAudioElement) {
  currentTime.value = Audio.currentTime;
}

async function duration(Audio: HTMLAudioElement) {
  try {
    await Audio.play();
    const duration = Audio.duration;
    sliderMax.value = duration;

    Audio.pause();
    return duration;
  } catch (err) {
    console.log("音频加载失败!");
  }
}

async function createAudio(url: string) {
  if (!url) return;

  Audio = document.createElement("audio");

  const that = Audio;
  Audio.src = url;
  await duration(Audio); //获取时长

  audioPlay(ref(false)); //第一次播放

  Audio.addEventListener("timeupdate", timeupdate.bind(that, Audio));
  Audio.addEventListener("error", () => {
    promptbox({
      mountNode: "#promptbox",
      title: "播放失败",
    });
  });
  Audio.addEventListener("ended", () => {
    status.value = false;
  });
}

watch(
  () => props.src,
  (value) => {
    if (!value || !!Audio) return;
    createAudio(value);
  }
);

let preTime = 0;

watch(currentTime, (curTime) => {
  emitCtx("currPlayTime", curTime + "");

  const time = Math.abs(curTime - preTime);
  if (time > 1) {
    Audio?.pause();

    Audio && (Audio.currentTime = curTime);
    audioPlay(ref(false));

    Audio?.play();
  }

  preTime = curTime;
});

onBeforeRouteLeave(() => {
  Audio?.pause();
  Audio = null;
});
</script>
<style scoped lang="scss"></style>
