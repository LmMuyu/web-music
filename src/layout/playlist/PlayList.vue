<template>
  <el-container :style="backgDropImage" class="h-full relative section_container">
    <el-main class="backdrop padd">
      <PlayListMain
        :singerName="singer"
        :musicInfo="musicDetailInfo"
        :musicName="unref(musicInfo)?.name"
      ></PlayListMain>
    </el-main>
    <el-footer class="flex items-center padd">
      <AudioContainer
        :src="audiosrc"
        :musicName="unref(musicInfo)?.name"
        :musicImage="unref(musicInfo)?.picUrl"
        :nickName="singer"
        background="#ff7675"
        @currPlayTime="currPlayTime"
        :playStatus="checkOption"
      ></AudioContainer>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import {
  ref,
  computed,
  unref,
  watch,
  nextTick,
  onUnmounted,
  watchEffect,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  getMusicDetail,
  getMusicUrl,
  whetherMusic,
} from "../../api/playList/index";
import { musicItemList } from "./hooks/data";
import { musicDetail } from "../../utils/musicDetail";
import { openDrawer } from "./components/PlayListHistory";
import { useWindowTitle } from "../../utils/useWindowTitle";
import {
  Ability,
  lycHighlightPos,
  recordData,
  recordStorage,
} from "./hooks/methods";

import { ElContainer, ElMain, ElFooter } from "element-plus";
import AudioContainer from "../../components/player/Audio.vue";
import PlayListMain from "./components/PlayListMain.vue";

interface MusicInfo {
  id: number;
  name: string;
  picUrl: string;
  singerInfo: any;
  singer: Record<string, any>[];
}

type checkOptions = { message: string; success: boolean };

const route = useRoute();
const store = useStore();

const musicId = route.query.id as string;
const musicInfo = ref<MusicInfo | null>(null);
const musicDetailInfo = ref({});
const main = ref<HTMLElement | null>(null);
const audiosrc = ref("");
const checkOption = ref<checkOptions>({
  message: "ok",
  success: true,
});

const record = ref({});
const bgimageUrl = ref("");

const singer = computed(
  () =>
    (musicInfo.value &&
      musicInfo.value.singer.map((info) => info.name).join("/")) ||
    ""
);

const routeEffect = watchEffect(() => {
  const istags = route.meta;
  Promise.resolve().then(() => routeEffect())
});

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

const backgDropImage = computed(() => {
  const backgImg = {
    backgroundImage: `url(${unref(bgimageUrl)})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",

  }
  return {
    ...backgImg,
    backdropFilter: "blur(20) saturate(180%)",
    ZIndex: -1,

  }
})

getMusicDetail(musicId)
  .then(({ data }) => {
    const songs = data.songs;

    Promise.resolve(songs).then((music) => {
      musicInfo.value = new musicDetail(music);
      musicDetailInfo.value = music[0];
      bgimageUrl.value = (musicInfo.value && musicInfo.value.picUrl) || "";
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

recordStorage(record); //获取记录

function Storage(e: StorageEvent) {
  const { key, newValue } = e;

  if (key === "userInfo" && newValue) {
    recordData(newValue, record);
  }
}

window.addEventListener("storage", Storage, false);

onUnmounted(() => {
  window.removeEventListener("storage", Storage, false);
});
</script>

<style scoped lang="scss">
.backdrop {
}

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

.section_container {
}
.bgcolor {
  @include position();
  background-color: #2d3436;
  opacity: 0.5;
  z-index: -1;
}
</style>
