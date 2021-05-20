<template>
  <ElRow class="w-full h-full">
    <ElCol :span="2"></ElCol>
    <ElCol :span="10"></ElCol>
    <ElCol :span="10">
      <div class="py-8">
        <div class="text-3xl text-white">{{ musicName }}</div>
        <div class="flex py-3">
          <span class="flex items-center text-lg">
            <p style="color: #f1f2f6">歌手:</p>
            <a style="color: #1f2937" class="ml-3 cursor-pointer hover">
              {{ singerName }}
            </a>
          </span>
        </div>
      </div>
      <div class="relative bg_image">
        <div
          :style="{ top: scrollBarTop + 'px' }"
          class="w-3 h-10 bg-black absolute right-0 rounded-lg"
        ></div>
        <div
          style="height: 30rem"
          class="overflow-y-scroll flex relative sliderTrack"
          ref="lyricNode"
          @scroll="lyricScroll"
        >
          <div
            class="pointer-events-auto"
            :style="{
              transform: `translate(0,${-currTop}px) translateZ(0)`,
            }"
          >
            <p
              style="color: #1f2937"
              class="py-3 text-lg text-left"
              v-for="musicItem in musicItemList.values()"
              :key="musicItem.playTime"
              :_id="musicItem.playTime"
            >
              {{ musicItem.lyc }}
            </p>
          </div>
        </div>
      </div>
    </ElCol>
    <ElCol :span="2"></ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  computed,
  defineProps,
  nextTick,
  onMounted,
  ref,
  watch,
} from "@vue/runtime-core";

import { conversionItem, lyricScroll } from "../hooks/methods";
import { getLyrics } from "../../../api/playList";
import { musicItemList, currTop, lyricNodeRect } from "../hooks/data";

import { ElRow, ElCol } from "element-plus";

import type { MatchItem } from "../type";

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

const point = computed(() => {
  return lyricNodeRect.offsetHeight / lyricNodeRect.scrollHeight;
});

const scrollBarTop = computed(() => {
  return point.value * currTop.value;
});

function lycSplice(iterator:IterableIterator<RegExpMatchArray>){
  let value = true;

  while (value) {
    const matchItem: { groups: MatchItem } = iterator.next().value;
    if (!matchItem) {
      value = false;
      break;
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
   
  lycSplice(iterator)
});

watch(musicItemList.value, () => {
  nextTick().then(() => {
    const node = lyricNode.value!;

    lyricNodeRect.offsetHeight = node.offsetHeight;
    lyricNodeRect.scrollHeight = node.scrollHeight - node.offsetHeight;
  });
});

onMounted(() => {
  // const childrenList = lyricNode.value?.children
  // const len = childrenList ? childrenList.length : 0
  // for (let i = 0; i < len; i++) {
  //   const el = childrenList?.[i];
  //   const id = +el?.getAttribute("_id")!
  //   const musicItem = musicItemList.value.get(id)!
  //   musicItem.node = el
  // }
});
</script>
<style scoped lang="scss">
.sliderTrack::-webkit-scrollbar {
  display: none;
}
.hover:hover::after {
  opacity: 1;
}

.hover {
  position: relative;

  &::after {
    @include absolute();
    content: "";
    display: block;
    width: inherit;
    border-bottom: 1px solid #fff;
    opacity: 0;
  }
}
</style>
