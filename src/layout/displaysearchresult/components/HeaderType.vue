<template>
  <div class="w-full h-full inline-flex items-center justify-between" @click="selectType">
    <span
      v-for="(type, key, index) in keyword"
      :key="key"
      class="h-full px-4 flex items-center"
      :style="activeStyle(index)"
      @click="clickActive(index)"
      @mouseenter="moveActive(index)"
      @mouseleave="leaveActive(index)"
    >
      <a href="javascript:void(;)" class="text-lg">
        {{ key }}
      </a>
    </span>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { activeIndex } from "../../../utils/activeIndex";

const ctxEmits = defineEmits(["selectType"]);

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(null, null, {
  enterColor: "#7cbcfc66",
  initColor: "#fff",
});

function keywordLists() {
  const keyword = {
    1: "单曲",
    10: "专辑",
    100: "歌手",
    1000: "歌单",
    1002: "用户",
    1004: "MV",
    1006: "歌词",
    1009: "电台",
    1014: "视频",
    1018: "综合",
    2000: "声音",
  };

  const keywords = {};

  for (const key in keyword) {
    keywords[keyword[key]] = key;
  }

  return ref(keywords);
}

const keyword = keywordLists();

function selectType(e) {
  const textContent = e.target.textContent;
  ctxEmits("selectType", textContent);
}

defineExpose({ keyword });
</script>
<style scoped lang="scss"></style>
