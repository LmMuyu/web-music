<template>
  <el-container style="height: 100vh">
    <el-main class="h-full w-full relative padd">
      <div class="bgcolor"></div>
      <div ref="main" class="h-full w-full bg_image"></div>
      <PlayListMain
        :singerName="singer"
        :musicInfo="musicDetailInfo"
        :musicName="unref(musicInfo)?.name"
      ></PlayListMain>
    </el-main>
    <el-footer class="flex items-center relative padd">
      <div class="absolute right-5 -top-4">
        <svg
          width="18"
          height="12"
          class="cursor-pointer"
          style="fill: none; stroke: black; stroke-width: 2"
        >
          <polyline points="0 12,9 0,18 12"></polyline>
        </svg>
      </div>

      <el-row class="bg-blue-400 w-full h-full">
        <el-col :span="20">
          <Audio
            :src="audiosrc"
            :musicName="unref(musicInfo)?.name"
            :musicImage="unref(musicInfo)?.picUrl"
            background="#ff7675"
            @currPlayTime="currPlayTime"
            :playStatus="checkOption"
          ></Audio
        ></el-col>
        <el-col :span="4">
          <div class="flex items-center w-full h-full">
            <i
              class="iconfont iconindent cursor-pointer"
              @click="openDrawer"
            ></i>
          </div>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { ref, computed, unref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

import {
  getMusicDetail,
  getMusicUrl,
  whetherMusic,
} from "../../api/playList/index";
import { musicItemList } from "./hooks/data";
import { musicDetail } from "../../utils/musicDetail";
import { Ability, lycHighlightPos } from "./hooks/methods";
import { openDrawer } from "./components/PlayListHistory";

import Audio from "/comps/player/Audio.vue";
import PlayListMain from "./components/PlayListMain.vue";
import { ElContainer, ElMain, ElFooter, ElRow, ElCol } from "element-plus";

import type { Singer as vocalist } from "../../utils/musicDetail";
import { useWindowTitle } from "../../utils/useWindowTitle";

interface MusicInfo {
  id: number;
  name: string;
  picUrl: string;
  singerInfo: vocalist;
  singer: Record<string, any>[];
}

type checkOptions = { message?: string; success?: boolean };

const musicId = useRoute().query.id as string;
const musicInfo = ref<MusicInfo | null>(null);
const musicDetailInfo = ref({});
const main = ref<HTMLElement | null>(null);
const audiosrc = ref("");
const checkOption = ref<checkOptions>({});

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

console.log(musicInfo.value?.name + "-" + singer.value);

const title = useWindowTitle();

let preNode: Element | null = null;

function isPlayer() {
  checkOption.value.success ||
    (checkOption.value = {
      message: "ok",
      success: true,
    });
}

function currPlayTime(time: string) {
  if (Number(time) < 1) Ability();

  isPlayer();

  const playTime = parseInt(time);
  const musicItem = musicItemList.value.get(playTime)!;
  const currNode = musicItem && unref(musicItem.node)!;

  if (currNode === void 0 || currNode === preNode) return;
  title.value = musicItem.lyc;

  if (!preNode) preNode = currNode;

  if (currNode !== preNode) {
    lycHighlightPos(musicItem.top, musicItemList, musicItem.indexId); //获取歌词高亮后
  }

  if (currNode !== preNode) {
    addClass(preNode, "remove");
    preNode = null;
  }

  addClass(currNode, "add");
}

function addClass(node: Element, mode: "remove" | "add") {
  switch (mode) {
    case "add":
      node.classList.remove("text_color");
      node.classList.add("text-blue-400");
      break;
    case "remove":
      node.classList.remove("text-blue-400");
      node.classList.add("text_color");
      break;

    default:
      break;
  }
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

    if (!src) return newError("src" + ":" + "null");
    audiosrc.value = src;
  });
</script>
<style scoped lang="scss">
@include Iconfont(#2c3e50, 24);

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
  opacity: 0.8;
  z-index: -1;
}
.bgcolor {
  @include position();
  background-color: #2d3436;
  opacity: 0.5;
  z-index: -1;
}
</style>
