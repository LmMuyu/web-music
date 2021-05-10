<template>
  <div class="flex items-center mx-6">
    <AudioAndVideoControls @play="audioPlay" />
    <div class="flex-1 mx-4">
      <Slider v-model="Post" :max="sliderMax" />
    </div>
    <CalculationTime :time="sliderMax" />
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
});

const Post = ref(0);
const sliderMax = ref(0);
let Audio: null | HTMLAudioElement = null;

function audioPlay() {
  Audio?.play();
}

function timeupdate(Audio: HTMLAudioElement) {
  Post.value = Audio.currentTime;
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
  console.log(url);

  if (!url) return;

  Audio = document.createElement("audio");

  const that = Audio;
  Audio.src = url;
  await duration(Audio);

  Audio.addEventListener("timeupdate", timeupdate.bind(that, Audio));
}

watch(
  () => props.src,
  (value) => {
    if (!value) return;
    console.log(value);

    createAudio(value);
  }
);
</script>
<style scoped lang="scss"></style>
