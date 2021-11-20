<template>
  <section ref="sectionNode" class="flex h-full">
    <div></div>
    <div class="p-4">
      <div class="flex py-3">
        <span class="flex items-center justify-center text-xl hover">
          <p class="headercolor">歌手:</p>
          <p
            style="color: #1f2937"
            class="text-xl ml-3 cursor-pointer singer-color"
          >{{ singerName }}</p>
        </span>
      </div>
      <div class="relative lycs_music">
        <div ref="trackNode" class="absolute top-0 right-0 bottom-0 w-1 h-full">
          <span
            class="absolute left-0 w-1 h-8 bg-black transition"
            :style="{ top: scrollBarTop + 'px' }"
          ></span>
        </div>
        <div
          class="flex flex-col overflow-y-scroll relative sliderTrack"
          style="height: 30rem"
          @scroll="lyricThrottle"
          ref="lyricNode"
        >
          <PlayLycs :musicItemList="[...musicItemList.values()]" />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, nextTick, ref, shallowRef } from "@vue/runtime-core";
import fastdom from "fastdom";

import { getLyrics } from "../../../api/playList";
import { conversionItem, lyricThrottle } from "../hooks/methods";
import { musicItemList, lyricNodeRect, clientHeight } from "../hooks/data";

import PlayLycs from "./PLayLycs.vue";

import type { MatchItem } from "../type";
import { onMounted } from "vue";
import { useType } from "../../../hooks";

const props = defineProps({
  musicInfo: {
    type: Object,
    required: true,
  },
  musicName: {
    type: String,
    default: "",
  },
  singerName: {
    type: String,
    default: "",
  },
});

const music = useRoute().query.id as string;
const lyricNode = ref<null | HTMLElement>(null);
const trackNode = ref<null | HTMLElement>(null);
const sectionNode = ref<null | HTMLElement>(null);

const trackSliderMaxH = ref(0);
const sliderH = ref(0)

const trackItemH = computed(() => {
  return (trackSliderMaxH.value - sliderH.value) / 100;
});

const newTop = computed(() => {
  return lyricNodeRect.scrollShiHeight / lyricNodeRect.scrollHeight;
});

const scrollBarTop = computed(() => {
  const y = Math.floor(newTop.value * 100) * trackItemH.value;
  if (useType(y) === "Null") return 0;
  return y;
});

function lycSplice(iterator: IterableIterator<RegExpMatchArray>) {
  while (true) {
    const matchItem: { groups: MatchItem } = iterator.next().value;
    if (!matchItem) {
      return;
    }

    matchItem.groups.lyc = matchItem.groups.lyc.replace(/(\[.+\])?/, "");

    const conMusicItem = conversionItem(matchItem.groups);
    musicItemList.value.set(conMusicItem.playTime, conMusicItem);
  }
}

getLyrics(music).then(({ data }) => {
  const lyrics = data.lrc.lyric as string;
  const lrcReg = /\[(?<playTime>.+)\]\s?(?<lyc>.+)/g;

  const iterator = lyrics.matchAll(lrcReg);
  lycSplice(iterator);
});

function setScrollHeight(height: number) {
  lyricNodeRect.scrollHeight = height - lyricNodeRect.offsetHeight;
}

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

  setScrollHeight(height);
}

onMounted(() => {
  nextTick().then(() => {
    lyricNodeRect.offsetHeight = lyricNode.value.offsetHeight;
    trackSliderMaxH.value = trackNode.value.clientHeight;
    sliderH.value = (trackNode.value.firstChild as HTMLElement).offsetHeight


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
  & > div:nth-child(1) {
    flex: 2;
  }

  & > div:nth-child(2) {
    flex: 1;
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
.hover {
  @include Decoration_Hover;

  & > p:nth-child(2) {
    @include Text_Color;
  }
}

.text_color {
  color: #1f2937;
}

.headercolor {
  color: $fontColor;
}

.transition {
  transition: all 0.2s linear;
}
</style>
