<template>
  <div
    class="w-full h-full inline-flex items-center justify-between"
    style="border-bottom: 1px solid rgba(113 119 144 / 25%)"
    @click="selectType"
  >
    <span
      v-for="(type, key, index) in keyword"
      :key="key"
      class="h-full px-4 flex items-center"
      :style="activeStyle(index)"
      @click="clickActive(index)"
      @mouseenter="moveActive(index)"
      @mouseleave="leaveActive(index)"
    >
      <a href="javascript:void(;)" class="lg:text-lg text-sm">{{ key }}</a>
    </span>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { activeIndex } from "../../../utils/activeIndex";

const ctxEmits = defineEmits(["selectType"]);

const props = defineProps({
  keyword: {
    type: Object,
    required: true,
  },
});

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(null, null, {
  enterColor: "#7cbcfc66",
  initColor: "#fff",
});

function keywordLists() {
  const keywords = {};

  for (const key in props.keyword) {
    keywords[props.keyword[key]] = key;
  }

  return ref(keywords);
}

const keyword = keywordLists();

function selectType(e) {
  const textContent = e.target.textContent;
  ctxEmits("selectType", textContent);
}
</script>
<style scoped lang="scss"></style>
