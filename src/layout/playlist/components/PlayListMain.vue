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
    <el-main class="w-full flex drop_filter">
      <el-row>
        <el-col :span="14"></el-col>
        <el-col :span="10">
          <div class="flex items-center w-full hover relative py-4">
            <span class="headercolor">歌手:</span>
            <span
              style="color: #1f2937"
              class="text-xl ml-3 cursor-pointer singer-color"
              v-html="singerName"
            ></span>
            <div
              class="absolute right-0 w-full bottom_hover"
              style="height: 3px; bottom: 25%"
            ></div>
          </div>
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
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import fastdom from "fastdom";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { computed, nextTick, ref, shallowRef, watchEffect } from "@vue/runtime-core";

import { useType } from "../../../hooks";
import { getLyrics } from "../../../api/playList";
import { conversionItem, lyricThrottle } from "../hooks/methods";
import { lyricNodeRect, clientHeight } from "../hooks/data";

import PlayLycs from "./PLayLycs.vue";
import { ElContainer, ElMain, ElRow, ElCol } from "element-plus";

import type { MatchItem } from "../type";
import { useStore } from "vuex";

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

const nickname = computed(() => props.singerName.split("/").join("——"));

onMounted(() => {
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
    backdrop-filter: blur(30px) saturate(180%);
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
</style>
