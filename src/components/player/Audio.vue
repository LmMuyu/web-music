<template>
  <div class="flex items-center w-full">
    <AudioAndVideoControls @play="audioPlay" />
    <div class="flex-1 mx-4">
      <Slider v-model="currentTime" :max="sliderMax" :background="background" />
    </div>
    <div>
      <div class="flex items-center">
        <div class="px-1">
          <CalculationTime :time="currentTime" />
        </div>
        <span class="px-1">/</span>
        <span class="px-1">
          <CalculationTime :time="sliderMax" />
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, watch } from "vue";

//@ts-ignore
import Slider from "/comps/slider/Slider.vue";
import CalculationTime from "./components/CalculationTime.vue";
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    default: "red",
  },
});

const currentTime = ref(0);
const sliderMax = ref(0);
let Audio: null | HTMLAudioElement = null;

function audioPlay() {
  Audio?.play();
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
  await duration(Audio);

  Audio.addEventListener("timeupdate", timeupdate.bind(that, Audio));
  Audio.addEventListener("error", (err) => {
    console.log(err);
  });
}

watch(
  () => props.src,
  (value) => {
    if (!value) return;
    createAudio(value);
  }
);

watch(currentTime, (value) => {
  console.log(value);
});
</script>
<style scoped lang="scss"></style>
