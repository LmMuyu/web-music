<template>
  <div class="flex">
    <div class="w-1/2"></div>
    <div class="w-1/2 flex justify-center relative">
      <div class="w-3 h-10 bg-black absolute top-0 right-0 rounded-lg"></div>
      <div @scroll="lyricScroll" class="overflow-y-scroll h-96 sliderTrack" ref="lyricNode">
        <p
          class="p-2"
          v-for="musicItem in musicItemList.values()"
          :key="musicItem.playTime"
          :_id="musicItem.playTime"
        >{{ musicItem.lyc }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { defineProps, nextTick, onMounted, ref } from "@vue/runtime-core";

import { getLyrics } from "../../../api/playList";
import { conversionPlayTime, lyricScroll } from "../hooks/methods";
import { musicItemList } from '../hooks/data'

import type { MatchItem } from '../type'

const music = useRoute().query.id as string;
const lyricNode = ref<null | HTMLElement>(null)


getLyrics(music).then(({ data }) => {
  const lyrics = data.lrc.lyric as string;
  const lrcReg = /\[(?<playTime>.+)\]\s?(?<lyc>.+)/g;

  const iterator = lyrics.matchAll(lrcReg);
  let value = true;

  while (value) {
    const matchItem: { groups: MatchItem } = iterator.next().value;
    if (!matchItem) {
      value = false;
      break;
    }

    const playTime = (matchItem.groups.playTime as number)

    musicItemList.value.set(playTime, conversionPlayTime(matchItem.groups));
  }
});

onMounted(() => {
  nextTick().then(() => {
    const childrenList = lyricNode.value?.children
    const len = childrenList ? childrenList.length : 0

    for (let i = 0; i < len; i++) {
      const el = childrenList?.[i];

      const id = +el?.getAttribute("_id")!
      const musicItem = musicItemList.value.get(id)

      musicItem && (musicItem.node = el)
    }

    console.log(
      musicItemList.value
    );

  })
})
</script>
<style scoped lang="scss">
.sliderTrack::-webkit-scrollbar {
  display: none;
}
</style>
