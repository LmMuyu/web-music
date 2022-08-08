<template>
  <el-container ref="sectionNode" class="flex h-full relative bg-white">
    <div class="drop_filter"></div>
    <el-header class="flex justify-center items-center header z-10">
      <div v-if="ifhidden" class="flex flex-col justify-center items-center">
        <span class="text-xl py-2 cursor-pointer z-10" style="color: black">{{ musicName }}</span>
        <div class="flex items-center justify-center">
          <span v-html="singerName" class="text-sm z-10"></span>
          <span> - </span>
          <span style="color: #b2bec3" class="text-sm"> {{ musicName }} </span>
        </div>
      </div>
      <transition
        enterFromClass="musicname_center_from"
        enterToClass="musicname_center_to"
        enterActiveClass="musicname_center_active"
      >
        <div v-if="!ifhidden">
          <span style="color: #303133" class="text-sm z-10">{{ musicName }}</span>
        </div>
      </transition>
    </el-header>
    <el-main
      ref="container_main"
      style="top: 60px"
      class="absolute scroll_bar left-0 w-full h-full flex"
    >
      <el-row style="height: 100vh">
        <el-col :span="10"> </el-col>
        <el-col :span="13">
          <div ref="container_lycs" class="relative lycs_music">
            <play-lycs
              v-if="lycsLists.length > 0"
              @transiateYPos="transiateYPos"
              @lyc-time="playLycTime"
              :musicItemList="lycsLists"
              :slideScrollTop="sliderH"
              :puremusic="puremusic"
              :rootstyle="transformStyle"
            ></play-lycs>
          </div>
        </el-col>
        <el-col :span="1"> </el-col>
      </el-row>
      <div class="w-full h-8 py-8"></div>
      <ElRow class="w-full">
        <ElCol :span="5" class="h-8 w-full"></ElCol>
        <ElCol :span="14" ref="comments" class="h-auto w-1/2">
          <ContainerComments :mid="Number(musicid)" />
        </ElCol>
        <ElCol :span="5"></ElCol>
      </ElRow>
      <div class="w-full h-24"></div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { onMounted, watch } from "vue";
import { computed, nextTick, onUnmounted, ref, watchEffect, shallowRef } from "@vue/runtime-core";

import { getLyrics } from "../../../api/playList";
import { conversionItem } from "../hooks/methods";
import { lyricNodeRect, clientHeight, distance } from "../hooks/data";
import { createAsComponent } from "../../../utils/createAsComponent";

import { ElContainer, ElMain, ElRow, ElCol, ElHeader } from "element-plus";
import PlayLycs from "./PLayLycs.vue";

import type { MatchItem } from "../type";

const ContainerComments = createAsComponent(
  () => import("./PlayListHistory/components/Comments.vue")
);

const props = defineProps({
  musicName: {
    type: String,
    default: "",
  },
  singerName: {
    type: String,
    default: "",
  },
  backgroundurl: {
    type: String,
    required: true,
  },
});

const route = useRoute();
let musicid = route.query.id as string;
const toScrollComments = route.params.toscroll;
const lyricNode = shallowRef<null | HTMLElement>(null);
const sectionNode = shallowRef<null | HTMLElement>(null);
const musicItemList = ref<Map<number, any>>(new Map());
const lycsLists = ref([]);
const store = useStore();
const ifhidden = ref(true);
const comments = ref(null);
const observerlists = [];
const container_lycs = shallowRef(null);
const container_main = ref(null);
const puremusic = ref(false);
const sliderH = ref(0);
const banscroll = ref(false);

function lycSplice(iterator: IterableIterator<RegExpMatchArray>) {
  while (true) {
    const matchItem: { groups: MatchItem } = iterator.next().value;
    if (!matchItem) {
      break;
    }

    matchItem.groups.lyc = matchItem.groups.lyc.replace(/(\[.+\])?/, "");

    const conMusicItem = conversionItem(matchItem.groups);
    musicItemList.value.set(conMusicItem.playTime, conMusicItem);
  }

  lycsLists.value = [...musicItemList.value.values()];
}

function compareMusic() {
  const songId = computed(store.getters["playlist/getSongId"]);

  const stop = watchEffect(() => {
    if (songId.value === 0) {
      store.commit("playlist/setSongId", musicid);

      Promise.resolve().then(() => {
        stop();
      });
    }
  });
}

compareMusic();

getLyrics(musicid).then(({ data }) => {
  if (data.qfy && data.sfy) puremusic.value = true;

  const lyrics = data.lrc.lyric as string;
  const lrcReg = /\[(?<playTime>.+)\]\s?(?<lyc>.+)/g;
  const iterator = lyrics.matchAll(lrcReg);
  lycSplice(iterator);
});

async function childrenMapNode(childrenList: HTMLElement[]) {
  const len = childrenList ? childrenList.length : 0;
  clientHeight.value = (lyricNode.value && lyricNode.value.clientHeight) || 0;

  for (let i = 0; i < len; i++) {
    const el = childrenList![i] as HTMLElement;

    const nodeid = +el.getAttribute("node_id")!;
    const indexId = +el.getAttribute("keyid")!;
    const musicItem = musicItemList.value.get(nodeid)!;

    musicItem.indexId = indexId;
    musicItemList.value.set(nodeid, musicItem);
  }
}

function transiateYPos(disty: number) {
  if (disty != undefined) {
    lyricNodeRect.scrollShiHeight = disty;
  }
}

function watchCommentsTree(commentnode: HTMLElement) {
  const mutation = new IntersectionObserver((mutation) => {
    const node = mutation[0];
    ifhidden.value = !node.isIntersecting;
  });

  mutation.observe(commentnode);

  observerlists.push(mutation);
}

function containerMainToScroll(toscroll: boolean | string, commentNode: HTMLElement) {
  if (toscroll === true || toscroll === "true") {
    const toTopPos = commentNode.scrollTop;

    if (toTopPos) {
      (container_main.value.$el as any).scrollTop = toTopPos + "px";
    } else {
      throw new Error("toTopPos：" + toTopPos);
    }
  }
}

watch(distance, scrollBorderCheck);

const transformStyle = computed(() => {
  return {
    transform: `translate3d(0,-${distance.value}px,0)`,
  };
});

function scrollBorderCheck(distancevalue: number) {
  if (distancevalue > (lyricNodeRect.scrollHeight - lyricNodeRect.offsetHeight) / 2) {
    banscroll.value = true;
  } else {
    banscroll.value = false;
  }
}

function playLycTime(time: string) {
  const t = time.split(":");
  const min = parseInt(t[0]) * 60;
  const sec = parseInt(t[1]);
  const totalsec = min + sec;

  store.commit("emitMitt", [
    "lyctime",
    { seeksec: totalsec, type: "lyc" } as { seeksec: number; type: "lyc" },
  ]);
}

onMounted(async () => {
  nextTick().then(() => {
    lyricNodeRect.offsetHeight = lyricNode.value.offsetHeight;

    const mutation = new MutationObserver((mutation) => {
      const node = mutation[0];
      const childrem = Array.from(node.target.childNodes).filter(
        (lycspan) => lycspan.nodeName === "SPAN"
      ) as HTMLElement[];
      childrenMapNode(childrem);
      disconnect();
    });

    function disconnect() {
      mutation.disconnect();
    }

    mutation.observe(lyricNode.value, { attributes: true, childList: true, subtree: true });
  });

  await nextTick();
  //@ts-ignore
  watchCommentsTree(comments.value.$el);
  containerMainToScroll(toScrollComments as string, comments.value);
});

onUnmounted(() => {
  observerlists.forEach((observe) => {
    console.log(observe.disconnect());
  });
});
</script>

<style scoped lang="scss">
$fontColor: #303841;

section {
  & > main {
    & > div:nth-child(1) {
      flex: 2;
    }

    & > div:nth-child(2) {
      flex: 1;
    }
  }

  & > .drop_filter {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    line-height: 2;
    margin: auto;
    background-image: linear-gradient(to bottom, #fafafa 0%, #fff 100%);
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      filter: blur(20px);
      z-index: -1;
      margin: -30px;
    }
  }
}

.lycs_music {
  & > div:nth-child(1) {
    @include Background;
  }
}

.sliderTrack::-webkit-scrollbar {
  display: none;
}
.hover:hover.bottom_hover {
  background-color: #1f2937;
}

.text_color {
  color: #1f2937;
}

.headercolor {
  color: $fontColor;
}

.transition {
  transition: all 0.2s linear;
  border-radius: 8px 8px 8px 8px;
  -moz-border-radius: 8px 8px 8px 8px;
  -webkit-border-radius: 8px 8px 8px 8px;
}

.musicname_center_from {
  transform: translate3d(0, 40px, 10px);
}

.musicname_center_to {
  transform: translate3d(0, 0, 0);
}

.musicname_center_active {
  transition: all 0.5s ease;
}

.scroll_bar::-webkit-scrollbar {
  display: none;
}
</style>
