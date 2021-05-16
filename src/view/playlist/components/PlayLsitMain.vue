<template>
  <ElRow>
    <ElCol :span="2"></ElCol>
    <ElCol :span="10"></ElCol>
    <ElCol :span="10">
      <div></div>
      <div class="relative">
        <div
          :style="{ top: scrollBarTop + 'px' }"
          class="w-3 h-10 bg-black absolute right-0 rounded-lg"
        ></div>
        <div
          style="height:30rem"
          class="overflow-y-scroll flex justify-center relative sliderTrack"
          ref="lyricNode"
          @scroll="lyricScroll"
        >
          <div class="pointer-events-auto" :style="setTransform">
            <p
              class="p-3 text-lg text-left"
              v-for="musicItem in musicItemList.values()"
              :key="musicItem.playTime"
              :_id="musicItem.playTime"
            >{{ musicItem.lyc }}</p>
          </div>
        </div>
      </div>
    </ElCol>
    <ElCol :span="2"></ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, defineProps, onMounted, reactive, ref } from "@vue/runtime-core";

import { conversionItem, lyricScroll } from "../hooks/methods";
import { getLyrics } from "../../../api/playList";
import { musicItemList, currTop } from '../hooks/data'

import { ElRow, ElCol } from 'element-plus'

import type { MatchItem } from '../type'

const props = defineProps({
  musicInfo: {
    type: Object,
    required: true
  }
})

const music = useRoute().query.id as string;
const lyricNode = ref<null | HTMLElement>(null)

const lyricNodeRect = reactive({
  offsetHeight: 0,
  scrollHeight: 0
})

const setTransform = computed(() => {
  return `transform:translate(0,${-currTop.value}px) translateZ(0)`
})

const point = computed(() => {
  return lyricNodeRect.offsetHeight / lyricNodeRect.scrollHeight
})

const scrollBarTop = computed(() => {
  const newY = point.value * currTop.value - 30
  return newY < 0 ? 0 : newY
})

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

    matchItem.groups.lyc = matchItem.groups.lyc.replace(/(\[.+\])?/, "")

    const conMusicItem = conversionItem(matchItem.groups)
    musicItemList.value.set(conMusicItem.playTime, conMusicItem);
  }
});

onMounted(() => {
  const node = lyricNode.value

  lyricNodeRect.offsetHeight = node && node.offsetHeight || 0
  lyricNodeRect.scrollHeight = node && node?.scrollHeight - node?.offsetHeight || 0

  // const childrenList = lyricNode.value?.children
  // const len = childrenList ? childrenList.length : 0

  // for (let i = 0; i < len; i++) {
  //   const el = childrenList?.[i];

  //   const id = +el?.getAttribute("_id")!
  //   const musicItem = musicItemList.value.get(id)!
  //   musicItem.node = el
  // }
})
</script>
<style scoped lang="scss">
.sliderTrack::-webkit-scrollbar {
  display: none;
}
</style>
