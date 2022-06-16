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
import { ref, watchEffect } from "vue";

import { activeIndex } from "../../../utils/activeIndex";

const ctxEmits = defineEmits(["selectType"]);

const props = defineProps({
  keywordlists: {
    type: Object,
    required: true,
  },
  type: String,
});

const defaultIndex = ref(0);

const keyword = keywordLists();

watchEffect(() => {
  if (props.type) {
  }
  const findIndex = Object.keys(keyword.value).findIndex((key) => key === props.type);
  findIndex !== -1 && (defaultIndex.value = findIndex);
});

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(defaultIndex, null, {
  enterColor: "#7cbcfc66",
  initColor: "#fff",
});

function keywordLists() {
  const keywords = {};

  for (const key in props.keywordlists) {
    keywords[props.keywordlists[key]] = key;
  }

  return ref(keywords);
}

function selectType(e) {
  const textContent = e.target.textContent;
  ctxEmits("selectType", textContent);
}
</script>
<style scoped lang="scss"></style>
