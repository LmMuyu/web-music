<template>
  <div class="relative overflow-scroll" ref="totalList">
    <div class="absolute top-0 right-0 h-8 w-2 bg-black"></div>
    <div
      @scroll="onScroll"
      class="slider_track flex flex-col"
      :style="{
        height: scrollHeight === 0 ? '100%' : scrollHeight + 'px',
      }"
    >
      <div v-for="(item, index) in sliceList" :key="index" class="h-8">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  nextTick,
  onMounted,
  reactive,
  ref,
} from "@vue/runtime-core";

import type { PropType } from "vue";

const props = defineProps({
  renderData: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  height: {
    type: Number,
    default: 50,
  },
  beforBuffer: {
    type: Number,
    default: 4,
  },
  affterBuffer: {
    type: Number,
    default: 4,
  },
  scrollHeight: {
    type: Number,
    default: 0,
  },
});

const sliceData = reactive({
  start: 0,
  end: 0,
});

const sliceList = ref<any>([]);

const totalList = ref<HTMLElement | null>(null);

computed(() => {
  const { start, end } = sliceData;
  return (sliceList.value = props.renderData.slice(start, end));
});

function onScroll() {
  console.log(123);
}

onMounted(() => {
  nextTick().then(() => {
    const clientHeight = totalList.value?.clientHeight;

    if (clientHeight) {
      sliceData.end = Math.round(clientHeight / props.height);
    }
  });
});
</script>
<style scoped lang="scss">
.slider_track::-webkit-scrollbar {
  display: none;
}
</style>
