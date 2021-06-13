<template>
  <ul class="flex items-center justify-between h-full">
    <li
      class="flex items-center h-full relative"
      v-for="(tagItem, index) in contentTags"
      :key="tagItem._id"
      @click="clickActive(index)"
      @mousemove="moveActive(index)"
      @mouseleave="leaveActive(index)"
    >
      <span
        @click="
          () => ctxEmit('loadComps', [tagItem.comname, tagItem.comchildren])
        "
        class="cursor-pointer"
        :style="activeStyle(index)"
      >
        {{ tagItem.tagname }}
      </span>
      <span :class="{ border_bottom: curIndex === index }"></span>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { defineEmit, ref } from "@vue/runtime-core";

import { contentTags } from "../hooks/data";
import { activeIndex } from "../../../utils/activeIndex";

const ctxEmit = defineEmit(["loadComps"]);

const curIndex = ref(0);
const moveIndex = ref(0);

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(
  curIndex,
  moveIndex
);
</script>
<style scoped lang="scss">
.border_bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid black;
}
</style>
