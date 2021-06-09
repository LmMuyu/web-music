<template>
  <ul class="list-none">
    <li
      v-for="(tag, index) in AsideTags"
      :key="tag.index"
      class="flex items-center cursor-pointer py-4 icons"
      @click="clickActive(index)"
      @mouseenter="moveActive(index)"
      @mouseleave="leaveActive(index)"
    >
      <i class="iconfont" :class="[tag.icon]" :style="activeStyle(index)"></i>
      <span
        class="text-2xl px-5"
        style="color: #636e72"
        :style="activeStyle(index)"
        >{{ tag.title }}</span
      >
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed } from "vue";

import { currentIndex, moveIndex, AsideTags } from "../hooks/data";
import { activeIndex } from "../../../utils/activeIndex";

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(
  currentIndex,
  moveIndex
);
</script>
<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}
</style>
