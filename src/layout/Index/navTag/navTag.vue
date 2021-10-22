<template>
  <ul class="flex items-center h-full" :class="jCenter(justifyCenter)">
    <li
      class="flex items-center h-full px-4 relative"
      v-for="(tagItem, index) in contentTags"
      :key="tagItem._id"
      @click="switchView(index, tagItem)"
      @mousemove="moveActive(index)"
      @mouseleave="leaveActive(index)"
    >
      <span class="cursor-pointer" :style="activeStyle(index)">{{
        tagItem.tagname
      }}</span>
      <span :class="{ border_bottom: curIndex === index }"></span>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { defineEmits, ref } from "@vue/runtime-core";

import { activeIndex } from "../../../utils/activeIndex";
import { contentTags } from "./hooks/data";

const ctxEmit = defineEmits(["loadComps"]);

const props = defineProps({
  justifyCenter: {
    type: String,
    default: "start",
  },
});

function jCenter(pos: string) {
  const jpos = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  return jpos[pos];
}

const curIndex = ref(0);
const moveIndex = ref(0);

function switchView(index: number, tagItem: any) {
  clickActive(index);
  ctxEmit("loadComps", [tagItem.comname, tagItem.comchildren]);
}

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
  border: 1px solid #74b9ff;
}
</style>
