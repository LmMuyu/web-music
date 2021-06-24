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
      <router-link
        :to="tag.path"
        class="text-2xl px-5"
        style="color: #636e72"
        :style="activeStyle(index)"
        >{{ tag.title }}</router-link
      >
    </li>
  </ul>
</template>
<script setup lang="ts">
import { currentIndex, moveIndex, AsideTags } from "../hooks/data";
import { activeIndex } from "../../../utils/activeIndex";
import { useRoute } from "vue-router";
import { watch } from "@vue/runtime-core";

watch(
  useRoute(),
  (route) =>
    (currentIndex.value =
      AsideTags.value.findIndex((value) => value.path === route.path) ?? 0)
);

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
