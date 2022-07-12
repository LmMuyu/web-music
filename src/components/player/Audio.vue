<template>
  <transition name="fide">
    <div
      @mouseenter="enterAudio"
      @mouseleave="leaveAudio"
      class="flex items-center h-full w-full px-4 relative bg-white z-50 audio_shadow"
      v-show="!isLeaveSanSecBelow"
      ref="audioSlider"
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
            <volume-icon @click="openVolume" :volume="volume"></volume-icon>
            <teleport to="#volume">
              <div :style="sliderPos" class="w-9 h-full absolute z-10">
                <el-slider height="100px" vertical v-model="volume" ref="volumecontrol">
                </el-slider>
              </div>
            </teleport>
          </div>
          <div @click="OpenHistory" class="flex items-center px-4">
            <font-icon icon="iconindent" size="24"></font-icon>
          </div>
          <div class="px-4">
            <router-link
              :to="{ name: 'Playlist', params: { toscroll: true }, query: { id: storeMid } }"
            >
              <font-icon icon="iconpinglun_huabanfuben" size="24"> </font-icon>
            </router-link>
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
    class="w-full h-4 absolute bottom-0 left-0 z-10"
  ></div>
</template>
<script setup lang="ts">
import {
  ref,
  nextTick,
  PropType,
  watchEffect,
  computed,
  onMounted,
  getCurrentInstance,
  reactive,
  watch,
} from "vue";
import { useStore } from "vuex";

import { getMusicDetail } from "../../api/playList";
import { useLocalStorage } from "../../utils/useLocalStorage";
import { musicDetail } from "../../utils/musicDetail";
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
import { openDrawer } from "../../layout/playlist/components/PlayListHistory";
import playerLists from "./playerlists";

const props = defineProps({
  songinfo: {
    type: Object as PropType<musicDetail>,
    required: true,
  },
});

const store = useStore();

let mid = 0;
const volume = ref(0);
const musicinfo = ref<musicDetail>();
const islock = ref(false);
const ctx = getCurrentInstance();
const audioSlider = ref(null);
const sliderPos = reactive({
  top: -window.innerHeight + "px",
  left: -window.innerWidth + "px",
});
const volumecontrol = ref<typeof ElSlider | null>(null);
let volumeControlStatus: "enter" | "remove" = "enter";
let tiemr = null;
let isLeaveSanSecBelow = ref<null | boolean>(null);

const dexie = dexieFn();
const {
  isplay,
  pause,
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
  againPlayIndexPos,
} = AudioHow(
  {
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

const controlAudioCompIf = computed(store.getters["getControlAudioCompIf"]);

watchEffect(() => {
  if (controlAudioCompIf.value === false) {
    isLeaveSanSecBelow.value = controlAudioCompIf.value;
  }
});

function volumeProcessing() {
  watch(volume, (volume) => setVolume(volume / 100));
}

volumeProcessing();

function leaveTimeout() {
  if (!controlAudioCompIf.value) {
    return;
  }

  tiemr = setTimeout(() => {
    isLeaveSanSecBelow.value = true;
  }, 1500);
}

function enterAudioActive() {
  if (!controlAudioCompIf.value) {
    return;
  }
  isLeaveSanSecBelow.value = false;
  clearAudioControlTimeout();
}

function clearAudioControlTimeout() {
  clearTimeout(tiemr);
  tiemr = null;
}

async function initShowAudioModule() {
  (await dexie).first().then((first) => {
    !first && (isLeaveSanSecBelow.value = true);
  });
}

initShowAudioModule();

function enterAudio() {
  enterAudioActive();
}

function leaveAudio() {
  if (!controlAudioCompIf) {
    return;
  }

  if (!islock.value) {
    leaveTimeout();
  }
}

function onLock() {
  islock.value = !islock.value;
}

function inputValue(pos: number) {
  musicPosTime.value = pos / 1000;
  setseek(pos);
}

const storeMid = computed<number>(store.getters["playlist/getSongId"]);
watchEffect(async () => {
  try {
    if (storeMid.value && storeMid.value !== mid) {
      mid = storeMid.value;

      const isIngPlay = againPlayIndexPos(mid);
      if (isIngPlay) {
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

function openVolume(e: Event & { clientX: number }) {
  if (volumeControlStatus === "remove") {
    openControl(-window.innerHeight + "px", -window.innerWidth + "px");

    return;
  }

  const volume = (e.target as unknown as HTMLElement).getBoundingClientRect();

  const vx = volume.left;
  const vw = volume.width;
  const audioTool = audioSlider.value as HTMLElement;
  const { offsetHeight, offsetWidth } = volumecontrol.value.$el as HTMLElement;

  if (vx && audioTool && vw && offsetHeight && offsetWidth) {
    const aty = audioTool.getBoundingClientRect();

    if (aty.top) {
      openControl(
        aty.top - offsetHeight - 5 + "px",
        vx - (offsetHeight * 0.15 + vw * 0.2) * 0.5 + "px"
      );
    }
  } else {
    console.error(vx, audioTool, vw, offsetHeight, offsetWidth);
  }
}

function openControl(top: string, left: string) {
  volumeControlStatus = volumeControlStatus === "enter" ? "remove" : "enter";
  sliderPos.top = top;
  sliderPos.left = left;
}

const playerlist = new playerLists();
async function OpenHistory() {
  if (playerlist.mounting) {
    playerlist.unmount();
  } else {
    playerlist.mount();
  }
}

onMounted(() =>
  nextTick().then(() => {
    sliderstyle();
    leaveTimeout();
  })
);
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
