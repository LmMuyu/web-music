<template>
  <div class="flex items-center relative h-full w-full">
    <div class="flex h-full w-full">
      <div class="flex flex-1 px-2">
        <div>
          <img class="object-cover" :src="musicImage + '?param=60y60'" :alt="musicName" />
        </div>
        <span class="flex justify-center flex-col ml-4 text-gray-700">
          <span class="flex-1 decoration">{{ musicName }}</span>
          <span class="text-sm flex-1 decoration">{{ nickName }}</span>
        </span>
      </div>
      <div class="flex flex-col mx-4" style="flex:3">
        <div>
          <AudioAndVideoControls :playStatus="playStatus" @play="playMusic"></AudioAndVideoControls>
        </div>
        <PlayMusicTime :starttime="100" :maxtime="380" class="w-full">
          <PlaySlider />
        </PlayMusicTime>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from "vue";
import { onBeforeRouteLeave } from "vue-router";

//@ts-ignore
import PlaySlider from "../../components/slider/Slider.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue"
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";

import { promptbox } from "../../components/promptBox";
import { status } from "./hook/data";

import type { Ref, PropType } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  musicImage: {
    type: String,
    default: "",
  },
  nickName: {
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
    type: Object as PropType<{ message: string; success: boolean }>,
    default: () => { },
  },
});

const emitCtx = defineEmits(["currPlayTime"]);

const currentTime = ref(0);
const maxTime = ref(0);
const musicStatus = ref(true);
let Audio: null | HTMLAudioElement = null;

const playMusic = () => audioPlay();

function audioPlay(status: Ref<boolean> = ref(false)) {
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
    maxTime.value = duration;

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
<style scoped lang="scss">
.decoration {
  text-decoration: none !important;

  &:hover {
    text-decoration: underline !important;
  }
}
</style>

