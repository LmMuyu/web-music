<template>
  <div class="flex items-center relative py-3 border_bar">
    <div style="font-size: 21px">推荐MV</div>
  </div>
  <div class="mt-8">
    <ul class="list-none grid">
      <li v-for="(MvItem, index) in renderData" :key="MvItem.id">
        <div
          class="relative"
          @mouseenter="onMouseenter(index)"
          @mouseleave="onMouseleave"
        >
          <img
            :src="MvItem.cover + '?param=224y140'"
            style="object-fit: cover"
          />
          <DiscoverMaskPlay :index="index" />
        </div>
        <div class="flex flex-col text-left">
          <span class="py-1 text-lg">{{ MvItem.name }}</span>
          <span
            class="py-1"
            style="color: #dfe6e9"
            v-html="computeDartists(MvItem.artists)"
          ></span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "@vue/runtime-core";
import { recommendMV } from "../../../../api/discover";
import { activeCurrent } from "../api/data";

import DiscoverMaskPlay from "./DiscoverMaskPlay.vue";

const renderData = ref<any>([]);

const computeDartists = computed(() => {
  return function (artists: Array<{ id: number; name: string }>) {
    return artists
      .map((value) => `<a class="cursor-pointer">${value.name}</a>`)
      .join("/");
  };
});

const onMouseenter = (index: keyof any) => {
  if (typeof index === "number") {
    activeCurrent.value = index;
  }
};

const onMouseleave = () => (activeCurrent.value = Number.MAX_SAFE_INTEGER);

onMounted(() => {
  nextTick(async () => {
    const { data } = await recommendMV();
    renderData.value = data.data;
  });
});
</script>
<style scoped lang="scss">
.border_bar {
  ::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 2px;
    background-color: #74b9ff;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}
</style>
