<template>
  <section class="w-full h-full text-center relative">
    <div class="relative">
      <img :src="play.coverImgUrl + '?param=144y90'" class="w-full h-full" />
      <router-link
        :to="{ path: '/playlist', query: { id: play.id } }"
        class="absolute top-0 bottom-0 left-0 right-0 z-50"
        target="_blank"
      ></router-link>
    </div>
    <p>{{ putPlayCount(play.playCount) }}</p>
    <p class="text-left cursor-pointer fotn_title">
      {{ play.name }}
    </p>
  </section>
</template>
<script setup lang="ts">
import { computed, defineProps } from "vue";

import type { PropType } from "vue";

const props = defineProps({
  play: {
    type: Object,
    required: true,
  },
  countRef: {
    type: Boolean,
    required: true,
  },
  curIndex: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  onMouseenter: {
    type: Function as PropType<(index: number) => void>,
    required: true,
  },
  negate: {
    type: Function,
    required: true,
  },
});

const putPlayCount = computed(() => {
  return function (count: number) {
    const playstr = String(count);
    const playlen = playstr.length;

    if (playlen >= 4) return count;
    const switchNum = playlen > 4 ? 0 : playlen > 8 ? 1 : 2;

    switch (switchNum) {
      case 0:
        const sliceSite = playlen - 4;
        return playstr.slice(0, sliceSite) + "万";
      case 1:
        const slicenum = playlen - 8;
        return playstr.slice(0, slicenum) + "万";
      default:
        return;
    }
  };
});
</script>
<style scoped lang="scss">
.fotn_title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
