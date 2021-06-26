<template>
  <div class="absolute top-0 bottom-0 w-full flex items-end overflow-y-hidden">
    <div
      bg_gray
      class="translateAm icon flex items-center transform w-full text-left"
      :class="[
        curIndex === index && countRef ? 'translate-y-0' : 'translate-y-full',
      ]"
      style="background: #74b9ff"
    >
      <i class="iconfont iconicon_headset"></i>
      <p class="transform translate-x-1 text-white">
        {{ putPlayCount(playCount) }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps } from "@vue/runtime-core";

const props = defineProps({
  playCount: {
    type: Number,
    default: 0,
  },
  curIndex: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  countRef: {
    type: Boolean,
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
.icon {
  @include Iconfont(#fff);
}
.translateAm {
  transition: all 0.3s ease-in-out;
}
</style>
