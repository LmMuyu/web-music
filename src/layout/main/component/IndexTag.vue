<template>
  <ul class="list-none">
    <li
      v-for="(tag, index) in AsideTags"
      :key="tag.index"
      class="flex items-center cursor-pointer py-4 icons"
      @click="clickClass(index)"
      @mouseenter="moveClass(index)"
      @mouseleave="leaveClass(index)"
    >
      <i class="iconfont" :class="[tag.icon]" :style="activeClass(index)"></i>
      <span
        class="text-2xl px-5"
        style="color: #636e72"
        :style="activeClass(index)"
        >{{ tag.title }}</span
      >
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed } from "vue";

import { currentIndex, moveIndex, AsideTags, mark } from "../hooks/data";
import { moveClass, clickClass, leaveClass } from "../hooks/methods";

import type { Ref } from "vue";

function setColor(curIndex: Ref<number>, index: number, color: string) {
  return {
    color: curIndex.value === index ? color : "#636e72",
  };
}

const activeClass = computed(() => (index: number) => {
  if (mark.value === "click" || currentIndex.value === index) {
    return setColor(currentIndex, index, "#74b9ff");
  }

  return mark.value === "move"
    ? setColor(moveIndex, index, "rgb(116, 185, 255,0.7)")
    : {
        color: "#636e72",
      };
});
</script>
<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}
</style>
