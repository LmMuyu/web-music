<template>
  <ul class="list-none" ref="x">
    <li
      v-for="(tag, index) in AsideTags"
      :key="tag.index"
      class="flex items-center cursor-pointer py-4 icons"
      @click="[clickActive(index), toPath(tag.path)]"
      @mouseenter="moveActive(index)"
      @mouseleave="leaveActive(index)"
    >
      <i class="iconfont" :class="[tag.icon]" :style="activeStyle(index)"></i>
      <a
        class="text-2xl px-5"
        style="color: #636e72"
        :style="activeStyle(index)"
        >{{ tag.title }}</a
      >
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

import { currentIndex, moveIndex, AsideTags } from "../hooks/data";
import { activeIndex } from "../../../utils/activeIndex";

const router = useRouter();

const toPath = (path: string) => router.push({ path });

router.beforeEach((to) => {
  currentIndex.value =
    AsideTags.value.findIndex((value) => value.path === to.path) ?? 0;
});

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
