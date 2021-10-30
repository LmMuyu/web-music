<template>
  <div class="flex items-center relative h-full w-full">
    <div class="flex items-center h-full w-full">
      <div class="flex flex-1 px-2">
        <div>
          <img class="object-cover" :src="musicImage + '?param=60y60'" :alt="musicName" />
        </div>
        <span class="flex justify-center flex-col ml-4 text-gray-700">
          <span class="flex-1 decoration">{{ musicName }}</span>
          <span class="text-sm flex-1 decoration">{{ nickName }}</span>
        </span>
      </div>
      <div class="flex flex-col mx-4" style="flex: 3">
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
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";
import PlaySlider from "../../components/slider/Slider.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue";

import { promptbox } from "../../components/promptBox";
import { status } from "./hook/data";

import type { Ref, PropType } from "vue";
import { getMvUrl } from "../../api/explore";

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

function clearTimer(timer: [number]) {
  clearTimeout(timer[0]);
  timer[0] = null;
  return true;
}

function getDuration(Audio: HTMLAudioElement): Promise<{ times: [number]; duration: number }> {
  return new Promise(async (resolve, reject) => {
    const times: [number] = [0];

    try {
      await Audio.play();

      times[0] = setTimeout(() => {
        const duration = Audio.duration;
        Audio.pause();
        resolve({ times, duration });
      }, 1000);
    } catch (err) {
      reject("ErrorType:音频加载失败!");
    }
  });
}

function audioPlay(status: Ref<boolean> = ref(false)) {
  musicStatus.value = status.value;
  status.value ? Audio?.pause() : Audio?.play();
}

function timeupdate(Audio: HTMLAudioElement) {
  currentTime.value = Audio.currentTime;
}

async function createAudio(url: string) {
  if (!url) return;
  Audio = document.createElement("audio");
  Audio.src = url;

  const newAudio = Audio;
  try {
    const { times, duration } = await getDuration(Audio); //获取时长
    console.log(duration);

    clearTimer(times);
    maxTime.value = duration;
  } catch (err) {
    console.error(err);
    return;
  }
  audioPlay(ref(false)); //第一次播放

  Audio.addEventListener("timeupdate", timeupdate.bind(newAudio, Audio), false);
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
