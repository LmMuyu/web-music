<template>
  <el-container style="height: 100vh">
    <el-main class="h-full w-full relative padd">
      <div class="bgcolor"></div>
      <div ref="main" class="h-full w-full bg_image"></div>
      <PlayLsitMain
        :singerName="singer"
        :musicInfo="musicDetailInfo"
        :musicName="unref(musicInfo)?.name"
      ></PlayLsitMain>
    </el-main>
    <el-footer class="flex items-center relative padd">
      <div class="bg-blue-400 h-full w-full">
        <Audio
          :src="audiosrc"
          :musicName="unref(musicInfo)?.name"
          :musicImage="unref(musicInfo)?.picUrl"
          background="#ff7675"
          @currPlayTime="currPlayTime"
          :playStatus="checkOption"
        ></Audio>
      </div>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { ref, computed, unref, reactive, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

import {
  getMusicDetail,
  getMusicUrl,
  whetherMusic,
} from "../../api/playList/index";
// import { musicItemList } from './hooks/data'
import { musicDetail } from "../../utils/musicDetail";

import Audio from "/comps/player/Audio.vue";
import PlayLsitMain from "./components/PlayLsitMain.vue";
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElMessage,
} from "element-plus";

import type { MatchItem } from "./type";
import type { Singer as vocalist } from "../../utils/musicDetail";
// import { createAudioContext } from "./hooks/methods";
// import axios from "axios";

interface MusicInfo {
  id: number;
  name: string;
  picUrl: string;
  singerInfo: vocalist;
  singer: Record<string, any>[];
}

const musicId = useRoute().query.id as string;
const musicInfo = ref<MusicInfo | null>(null);
const musicDetailInfo = ref({});
const checkOption = ref({});
const audiosrc = ref("");
const main = ref<HTMLElement | null>(null);

const bgimageUrl = ref("");

watch(bgimageUrl, (src) =>
  nextTick(
    () => main.value && (main.value.style.backgroundImage = `url(${src})`)
  )
);

const singer = computed(
  () =>
    (musicInfo.value &&
      musicInfo.value.singer.map((info) => info.name).join("/")) ||
    ""
);

// let infoobj: MatchItem | null = null

function currPlayTime(time: string) {
  const playTime = parseInt(time);

  // const musicItem = musicItemList.value.get(playTime)!

  // if (!infoobj) infoobj = musicItem

  // if (infoobj !== musicItem) {
  //   infoobj.node?.classList.remove("bg-blue-400")
  //   infoobj = null
  // }

  // musicItem?.node?.classList.add("bg-blue-400")
}

function newError(mess: string) {
  throw new Error(mess);
}

getMusicDetail(musicId)
  .then(({ data }) => {
    const songs = data.songs;

    Promise.resolve(songs).then((music) => {
      musicInfo.value = new musicDetail(music);
      musicDetailInfo.value = music[0];
      bgimageUrl.value = musicInfo.value?.picUrl;
    });

    return musicId;
  })
  .then(async () => {
    const res = await whetherMusic(musicId);
    checkOption.value = res.data;

    return musicId;
  })
  .then(async (id: string | undefined) => {
    if (!id) return newError("src" + ":" + "null");

    const { data } = await getMusicUrl(id);
    const src = data.data[0].url;

    // const res = await axios({
    //   url: src,
    //   responseType: "arraybuffer",
    // });

    // const audioSource = await createAudioContext(res.data);
    // typeof audioSource !== "boolean" && audioSource.start();

    if (!src) return newError("src" + ":" + "null");
    audiosrc.value = src;
  });
</script>
<style scoped lang="scss">
@mixin position {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.padd {
  padding: 0 !important;
}

.bg_image {
  @include position();
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(90px);
  opacity: 0.6;
  z-index: -1;
}
.bgcolor {
  @include position();
  background-color: #2d3436;
  opacity: 0.8;
  z-index: -1;
}
</style>
