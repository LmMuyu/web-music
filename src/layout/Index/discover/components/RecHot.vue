<template>
  <div class="flex py-3">
    <div class="flex items-center translate-x-4 font_size" style="flex: 1">
      <span class="cursor-default">热门推荐</span>
    </div>
    <div style="flex: 2">
      <ul class="list-none flex items-center h-full">
        <p class="whitespace-nowrap">类别：</p>
        <li
          v-for="(tag, index) in hotName"
          :key="`tag_${tag.id}`"
          class="text-sm text-gray-500 text-center whitespace-nowrap"
          :class="catClassItem(index)"
          :style="{ color: catStyleItem(curindex, index) }"
          @mouseenter="curindex = index"
          @mouseleave="curindex = index"
        >
          <router-link :to="`/index/recommend?hotname=${tag.name}`">{{ tag.name }}</router-link>
        </li>
      </ul>
    </div>
    <div style="flex: 1">
      <span
        class="flex items-center justify-end h-full text-black transform -translate-x-4 cursor-pointer icon"
      >
        <p>更多</p>
        <i class="iconfont iconup-copy-copy"></i>
      </span>
    </div>
  </div>
  <div class="my-4">
    <RecPlaylist />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, provide, ref, watch } from "vue";

import RecPlaylist from "./RecPlaylist.vue";

const props = defineProps({
  categoryname: {
    type: Array,
    required: true,
  },
  playlist: {
    type: Array,
    default: () => [],
  },
});

const cardList = ref([])

provide("cardlist", cardList);

const playliststopFn = watch(() => props.playlist, (value) => {
  cardList.value = value
  Promise.resolve().then(() => playliststopFn())
})

const curindex = ref(0);

function catClassItem(index: number) {
  return index == 0 ? "pr-4" : "px-4";
}

function catStyleItem(curindex: number, index: number) {
  return curindex === index ? "#74b9ff" : "";
}

const hotName = computed<any[]>(() => props.categoryname.slice(0, 5));
</script>

<style lang="scss">
.icon {
  @include Iconfont(#74b9ff);
}

.border_bar {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 2px;
    background-color: #74b9ff;
  }
}

.font_size {
  font-size: 21px;
}

.text_shadow {
  box-shadow: 0 10px 40px -10px rgba(0, 64, 128, 0.2);
}
</style>
