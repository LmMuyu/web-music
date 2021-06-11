<template>
  <div class="flex items-center relative py-3 border_bar" data-v-b3371f40="">
    <div class="text-3xl">推荐MV</div>
  </div>
  <div class="mt-8">
    <ul class="list-none flex items-center justify-between flex-wrap">
      <li v-for="MvItem in renderData" :key="MvItem.id">
        <div class="w-auto h-auto relative">
          <img :src="MvItem.cover + '?param=224y140'" />
          <div class="bg_color" :class="setClassList">
            <svg width="32" height="32">
              <circle
                cx="16"
                cy="16"
                r="15"
                stroke="#b2bec3"
                stroke-width="2"
                fill="none"
                class="flex justify-center items-center"
              ></circle>

              <polygon
                points="32,16 0,0 0,32"
                style="fill: none; stroke: purple; stroke-width: 1"
              />
            </svg>
          </div>
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

const renderData = ref<any>([]);

const computeDartists = computed(() => {
  return function (artists: Array<{ id: number; name: string }>) {
    return artists
      .map((value) => `<a class="cursor-pointer">${value.name}</a>`)
      .join("/");
  };
});

const setClassList = computed(() => {
  return [
    "absolute",
    "left-1/2",
    "right-0",
    "bottom-0",
    "top-1/2",
    "transform",
    "-translate-x-1/2",
    "-translate-y-1/2",
    "flex",
    "items-center",
    "justify-center",
  ];
});

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

.bg_color {
  background: rgb(99, 110, 114, 0.7);
  z-index: 9;
}
</style>
