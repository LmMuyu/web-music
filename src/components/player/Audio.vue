<template>
  <div class="flex items-center relative h-full w-full audio_shadow">
    <div class="flex items-center h-full w-full px-4">
      <div class="flex" style="flex: 1">
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
      <div style="flex: 3" class="flex flex-col w-full">
        <div>
          <AudioAndVideoControls
            @next="controlsMethods.next"
            @pre="controlsMethods.pre"
            @play="controlsMethods.play"
            @pause="controlsMethods._pause"
          ></AudioAndVideoControls>
        </div>
        <div class="flex justify-center itmes-center">
          <PlayMusicTime :starttime="starttime" :maxtime="maxtime" class="w-full">
            <PlaySlider v-model="starttime" :max="maxtime" />
          </PlayMusicTime>
          <!-- <div>
            <el-slider class="transform -translate-y-full" v-model="volume" vertical height="80px">
            </el-slider>
          </div> -->
          <div @click="openRightDrawer">歌曲</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted } from "vue-demi";
import { useStore } from "vuex";
import { reactive, ref } from "vue";

import Howl from "./play";
import { isType } from "../../utils/methods";
import { musicDetail } from "../../utils/musicDetail";
import { openDrawer } from "../../layout/playlist/components/PlayListHistory";

//@ts-ignore
import AudioAndVideoControls from "./components/AudioAndVideoControls.vue";
import PlaySlider from "../../components/slider/Slider.vue";
import PlayMusicTime from "./components/PlayMusicTime.vue";
import { ElSlider } from "element-plus";

const maxtime = ref(0);
const starttime = ref(0);
const volume = ref(0);
const historyData = ref([]);
const musicinfoName = ref([]);

const id = useRoute().query.id as unknown as number;

const controlsMethods = reactive({
  pre: () => {},
  play: () => {},
  _pause: () => {},
  next: () => {},
});

const musicHowler = new Howl();
const store = useStore();
const musicinfo = ref<musicDetail>();

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

      if (key === "duration" && isType(key) !== "Null") {
        maxtime.value = value;
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

onMounted(() => {
  playHowl.playid = id;
  maxtime.value = parseFloat(localStorage.getItem("duration"));
});

defineExpose({
  musicinfo,
});
</script>
<style scoped lang="scss">
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
