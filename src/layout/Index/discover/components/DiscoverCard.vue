<template>
  <section
    class="w-full h-full text-center relative"
    @mouseenter="onMouseenter(index)"
    @mouseleave="onMouseleave"
  >
    <div class="relative">
      <img
        :src="
          (play?.creator?.backgroundUrl || play?.creator?.coverImgUrl) +
          '?param=144y90'
        "
        :alt="play.alg_sq_featured"
        class="w-full h-full"
      />

      <router-link
        :to="{ path: '/playlist', query: { id: play.id } }"
        class="absolute top-0 bottom-0 left-0 right-0 z-50"
        target="_blank"
      ></router-link>

      <DiscoverPlayCount
        :play-count="play.playCount"
        :count-ref="countRef"
        :cur-index="curIndex"
        :index="index"
      />
    </div>
    <p class="whitespace-pre-wrap text-left cursor-pointer fotn_title">{{ play.name }}</p>
  </section>
</template>
<script setup lang='ts'>
import { defineProps } from "vue"

import DiscoverPlayCount from "./DiscoverPlayCount.vue"

import type { PropType, Ref } from "vue"
import type { PlayListOptions } from "../type"

const props = defineProps({
  play: {
    type: Object as PropType<PlayListOptions>,
    required: true
  },
  countRef: {
    type: Boolean,
    required: true
  },
  curIndex: {
    type: Number,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  onMouseenter: {
    type: Function as PropType<(index: number) => void>,
    required: true
  },
  negate: {
    type: Function,
    required: true
  }
})

const onMouseleave = () => props.negate()


</script>
<style scoped lang='scss'>
.fotn_title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>