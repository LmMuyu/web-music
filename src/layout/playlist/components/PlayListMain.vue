<template>
  <el-container
    :style="{
      backgroundImage: `url('${backgroundurl}')`,
      backgroundRepeat: 'no-repeat',
      backgroundOrigin: 'content-box',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
    ref="sectionNode"
    class="flex h-full relative"
  >
    <div class="drop_filter"></div>
    <el-header class="flex flex-col justify-center items-center header z-10">
      <div v-if="ifhidden">
        <span class="text-xl py-2 cursor-pointer z-10" style="color: black">
          {{ musicName }}
        </span>
        <div style="transform: translate3d(-13%, 0, 0)" class="flex items-center justify-center">
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
        <span v-if="!ifhidden" style="color: #303133" class="text-sm z-10">{{ musicName }}</span>
      </transition>
    </el-header>
    <el-main ref="container_main" class="w-full flex">
      <el-row style="height: 100vh">
        <el-col :span="10"> </el-col>
        <el-col :span="13">
          <div ref="container_lycs" class="relative lycs_music">
            <div
              class="flex flex-col overflow-y-scroll relative sliderTrack"
              style="height: 30rem"
              ref="lyricNode"
              @scroll="lyricThrottle"
            >
              <play-lycs
                v-if="lycsLists.length > 0"
                @transiateYPos="transiateYPos"
                @selectlycs="clickScrollTop"
                :musicItemList="lycsLists"
                :slideScrollTop="sliderH"
                :puremusic="puremusic"
                :rootstyle="transformStyle"
              />
            </div>

            <div ref="trackNode" class="absolute top-0 right-0 bottom-0 w-1 h-full">
              <span
                class="absolute left-0 w-1 h-8 transition"
                :style="{ top: scrollBarTop + 'px' }"
                style="background-color: #3a3a59"
              ></span>
            </div>
          </div>
        </el-col>
        <el-col :span="1"> </el-col>
      </el-row>
      <div class="w-full flex justify-center">
        <div ref="comments" class="h-auto w-1/2">
          <ContainerComments :mid="Number(musicid)" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { computed, nextTick, onUnmounted, ref, watchEffect, shallowRef } from "@vue/runtime-core";

import { useType } from "../../../hooks";
import { getLyrics } from "../../../api/playList";
import { lyricNodeRect, clientHeight, distance } from "../hooks/data";
import { conversionItem, lyricThrottle } from "../hooks/methods";
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
const trackNode = shallowRef<null | HTMLElement>(null);
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

const trackSliderMaxH = ref(0);
const sliderH = ref(0);

const weizX = computed(() => {
  return Number(
    (
      trackSliderMaxH.value /
      (lyricNodeRect.scrollHeight + sliderH.value - trackSliderMaxH.value)
    ).toFixed(3)
  );
});

const scrollBarTop = computed(() => {
  const y = lyricNodeRect.scrollShiHeight * weizX.value;
  if (useType(y) === "Null") return 0;
  return y;
});

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

function clickScrollTop(e: HTMLElement) {
  if (!e) return;

  const { top: lyTop } = e.getBoundingClientRect();
  const { top: clTop } = container_lycs.value.getBoundingClientRect();

  const scrollTotalHeight = lyricNodeRect.scrollHeight - lyricNodeRect.offsetHeight;

  if (scrollTotalHeight && lyTop && clTop && lyTop - clTop <= scrollTotalHeight) {
    lyricNodeRect.scrollShiHeight = lyTop - clTop;
  }
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

const transformStyle = computed(() => {
  let movey = 0;

  const totalH = lyricNodeRect.scrollHeight - lyricNodeRect.offsetHeight;

  if (distance.value > totalH) {
    const diffy = totalH - distance.value;
    distance.value -= distance.value - diffy;
    movey = distance.value;
  } else {
    movey = distance.value;
  }

  return {
    transform: `translate3d(0,-${movey}px,0)`,
  };
});

onMounted(async () => {
  nextTick().then(() => {
    lyricNodeRect.offsetHeight = lyricNode.value.offsetHeight;
    trackSliderMaxH.value = trackNode.value.clientHeight;

    sliderH.value = (trackNode.value.firstChild as HTMLElement).offsetHeight;

    function disconnect() {
      mutation.disconnect();
    }

    const mutation = new MutationObserver((mutation) => {
      const node = mutation[0];
      const childrem = Array.from(node.target.childNodes).filter(
        (lycspan) => lycspan.nodeName === "SPAN"
      ) as HTMLElement[];
      childrenMapNode(childrem);
      disconnect();
    });

    mutation.observe(lyricNode.value, { attributes: true, childList: true, subtree: true });
  });

  await nextTick();
  watchCommentsTree(comments.value);
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
    border-radius: 5px;
    background: rgb(245, 247, 250, 0.9);
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
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
</style>
