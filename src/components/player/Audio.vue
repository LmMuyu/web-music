<template>
  <transition name="fide">
    <div
      @mouseenter="enterAudio"
      @mouseleave="leaveAudio"
      class="flex items-center h-full w-full px-4 relative bg-white z-50 audio_shadow"
      v-show="isLeaveSanSecBelow"
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
              :to="{ name: 'Playlist', params: { toscroll: true }, query: { id: playMid } }"
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
    v-if="!isLeaveSanSecBelow"
    @mouseenter="enterAudio"
    class="w-full h-4 absolute bottom-0 left-0 z-10"
  ></div>
</template>
<script setup lang="ts">
import {
  ref,
  nextTick,
  watchEffect,
  computed,
  onMounted,
  getCurrentInstance,
  reactive,
  watch,
  onUnmounted,
} from "vue";
import { useStore } from "vuex";

import { AudioStatus } from ".";
import AudioHow from "./Howler";
import playerLists from "./playerlists";
import dexieFn from "../../common/dexie";
import { musicDetail } from "../../utils/musicDetail";
import { musicPlayEndZero, sliderstyle } from "./methods";
import { useLocalStorage } from "../../utils/useLocalStorage";
import { getMusicDetail, userRecord } from "../../api/playList";

//@ts-ignore
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";
import AudioSongInfoShow from "./components/AudioSongInfoShow.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue";
import AudioSlider from "./components/AudioSlider.vue";
import { ElSlider, ElRow, ElCol } from "element-plus";
import VolumeIcon from "./components/VolumeIcon.vue";
import FontIcon from "../fonticon/FontIcon.vue";

const store = useStore();

let tiemr = null;
const volume = ref(0);
const islock = ref(false);
const audioSlider = ref(null);
const playMid = ref(0);
const sliderPos = reactive({
  top: -window.innerHeight + "px",
  left: -window.innerWidth + "px",
});
const ctx = getCurrentInstance();
const musicinfo = ref<musicDetail>();
const volumecontrol = ref<typeof ElSlider | null>(null);
let volumeControlStatus: "enter" | "remove" = "enter";
let isLeaveSanSecBelow = ref<null | boolean>(false);

const dexie = dexieFn();
const {
  isplay,
  pause,
  play,
  maxTime,
  nextMusic,
  preveMusic,
  seek: setseek,
  setImmdPlayLists,
  volume: setVolume,
  playSeek: seekTime,
  routeWatchStop,
  pairingPlayMid,
  existPlayerList,
  findMusicLists,
  stopWatchLogin,
} = await AudioHow(
  {
    musicinfoRef: musicinfo,
  },
  getCurrentInstance()
);
const playerlist = new playerLists();
const AStatus = new AudioStatus();

const musicPosTime = seekTime();
volume.value = setVolume() * 100;
musicPlayEndZero(ctx, musicPosTime);

const audioPlayTime = computed(() => {
  const musicTime = Math.round(musicPosTime.value);
  return musicTime * 1000;
});

watch(volume, (volume) => setVolume(volume / 100));

//判断Audio是不是默认显示
AStatus.p.then((status: boolean) => {
  isLeaveSanSecBelow.value = status;
});

function leaveTimeout() {
  if (AStatus.status.value) {
    leaveTimeout.clearAudioControlTimeout();
    return;
  }

  tiemr = setTimeout(() => {
    isLeaveSanSecBelow.value = false;
  }, 1500);
}

function enterAudioActive() {
  if (AStatus.status.value) {
    return;
  }

  isLeaveSanSecBelow.value = true;
  leaveTimeout.clearAudioControlTimeout();
}

leaveTimeout.clearAudioControlTimeout = function () {
  clearTimeout(tiemr);
  tiemr = null;
};

function enterAudio() {
  enterAudioActive();
}

function leaveAudio() {
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

function lastPlayRecord() {
  const islogin = computed(() => store.getters["login/getIslogin"]);
  const storeUserData = computed<any>(store.getters["login/getUserData"]);

  const stopLogin = watchEffect(async () => {
    if (islogin?.value && Object.keys(storeUserData.value).length > 0) {
      if (storeUserData.value?.data) {
        const lastRecord = await userRecord(storeUserData.value.data.id, "0");
        const lastRecordLists = lastRecord.data.allData.map((v) => new musicDetail(v.song));
        store.commit("playlist/musiclists", lastRecordLists);
      }
    }
  });

  return stopLogin;
}

const stopLogin = lastPlayRecord();

store.commit("playlist/setPlayerFn", async (mid: number) => {
  try {
    let musicSongInfo = null;

    playMid.value = mid;
    //重复播放代表暂停播放
    const isPlaying = pairingPlayMid(mid);
    if (isPlaying) return pause();

    if (!existPlayerList(mid)) {
      const reqdata = await getMusicDetail(String(mid));
      if (reqdata.data.songs.length === 0) return;

      const song = reqdata.data.songs[0];
      musicSongInfo = new musicDetail(song);
      setImmdPlayLists(musicSongInfo);
    } else {
      musicSongInfo = findMusicLists(mid);
    }

    Promise.resolve().then(() => store.commit("playlist/setSongInfo", musicSongInfo));

    //用来修改每一次听的歌曲时长
    musicinfo.value = musicSongInfo;

    //唤醒Audio
    enterAudioActive();
    leaveAudio();

    if (!store.getters["login/getIslogin"]) {
      //写入indexDB
      (await dexie).put(musicSongInfo.id, musicSongInfo);
    }

    useLocalStorage("recplaysong", JSON.stringify(musicSongInfo));
  } catch (error) {
    console.log(error);
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

async function OpenHistory() {
  if (playerlist.mounting) {
    playerlist.unmount();
  } else {
    playerlist.mount();
  }
}

class clickLycPlaySeek {
  private key: string;
  constructor() {
    this.key = "lyctime";

    this.bindMittFn();
  }

  bindFn(seektime: { seeksec: number; type: "lyc" }) {
    if (seektime.type && seektime.type === "lyc") {
      console.log(seektime);
    }
  }

  private bindMittFn() {
    store.commit("bindMitt", [this.key, this.bindFn]);
  }

  removeMittFn() {
    store.commit("removeMitt", this.key);
  }
}

const clickLycTime = new clickLycPlaySeek();

onMounted(() =>
  nextTick().then(() => {
    sliderstyle();
    leaveTimeout();
  })
);

onUnmounted(() => {
  stopLogin();
  routeWatchStop();
  stopWatchLogin();
  clickLycTime.removeMittFn();
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
