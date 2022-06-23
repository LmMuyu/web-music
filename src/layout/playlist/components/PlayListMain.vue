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
    <el-header class="flex flex-col justify-center items-center header">
      <div v-if="ifhidden">
        <span class="text-xl py-4 cursor-pointer z-10" style="color: #303133">
          {{ musicName }}
        </span>
        <div class="flex items-center justify-center transform-gpu">
          <span style="color: #1f2937" v-html="singerName" class="text-sm z-10"></span>
          <span> - </span>
          <span style="color: #1f2937" class="text-sm"> {{ musicName }} </span>
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
    <el-main class="w-full flex">
      <el-row>
        <el-col :span="14"> </el-col>
        <el-col :span="10">
          <div class="relative lycs_music">
            <div
              class="flex flex-col overflow-y-scroll relative sliderTrack"
              style="height: 30rem"
              @scroll="lyricThrottle"
              ref="lyricNode"
            >
              <play-lycs
                v-if="lycsLists.length > 0"
                @transiateYPos="transiateYPos"
                :musicItemList="lycsLists"
                :slideScrollTop="sliderH"
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
      </el-row>
      <div class="w-full flex">
        <div class="flex-1"></div>
        <div style="flex: 2">
          <div class="w-full h-32"></div>
          <div ref="comments">
            <ContainerComments :mid="Number(musicid)" />
          </div>
        </div>
        <div class="flex-1"></div>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import fastdom from "fastdom";
import { useStore } from "vuex";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { computed, nextTick, onUnmounted, ref, shallowRef, watchEffect } from "@vue/runtime-core";

import { useType } from "../../../hooks";
import { getLyrics } from "../../../api/playList";
import { conversionItem, lyricThrottle } from "../hooks/methods";
import { lyricNodeRect, clientHeight } from "../hooks/data";

import { ElContainer, ElMain, ElRow, ElCol, ElHeader } from "element-plus";
import PlayLycs from "./PLayLycs.vue";

import type { MatchItem } from "../type";

import { createAsComponent } from "../../../utils/createAsComponent";

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

let musicid = useRoute().query.id as string;
const lyricNode = ref<null | HTMLElement>(null);
const trackNode = ref<null | HTMLElement>(null);
const sectionNode = ref<null | HTMLElement>(null);
const musicItemList = ref<Map<number, any>>(new Map());
const lycsLists = ref([]);
const store = useStore();
const ifhidden = ref(true);
const comments = ref(null);
const observerlists = [];

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
  const lyrics = data.lrc.lyric as string;
  const lrcReg = /\[(?<playTime>.+)\]\s?(?<lyc>.+)/g;
  const iterator = lyrics.matchAll(lrcReg);
  lycSplice(iterator);
});

async function childrenMapNode(childrenList: HTMLElement[]) {
  const len = childrenList ? childrenList.length : 0;
  clientHeight.value = (lyricNode.value && lyricNode.value.clientHeight) || 0;

  function getClientHeight(el: HTMLElement): Promise<number> {
    return new Promise((resolve) => {
      fastdom.measure(() => {
        const height = el.clientHeight;
        resolve(height);
      });
    });
  }

  let height = 0;
  for (let i = 0; i < len; i++) {
    const el = childrenList![i] as HTMLElement;

    const nodeid = +el.getAttribute("node_id")!;
    const indexId = +el.getAttribute("keyid")!;
    const musicItem = musicItemList.value.get(nodeid)!;

    height += await getClientHeight(el);

    musicItem.node = shallowRef(el);
    musicItem.indexId = indexId;
    musicItem.top = height;

    musicItemList.value.set(nodeid, musicItem);
  }

  // setScrollHeight(height);
}

function transiateYPos(disty: number) {
  console.log(disty);

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

const nickname = computed(() => props.singerName.split("/").join("——"));

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
