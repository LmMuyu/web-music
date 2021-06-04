<template>
  <div class="relative overflow-auto" @scroll="onScroll" ref="totalList">
    <div class="absolute top-0 right-0 h-8 w-2 bg-black"></div>
    <div
      class="slider_track flex flex-col"
      :style="{
        height: scrollHeight === 0 ? '100%' : scrollHeight + 'px',
        transform,
      }"
    >
      <div
        v-for="item in sliceList"
        :key="item.id"
        class="h-8 flex items-center"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  watch,
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

const slicePos = reactive({
  start: 0,
  end: 0,
});

const totalList = ref<HTMLElement | null>(null);
const startOffset = ref(0);
const rootClientHeight = ref(0);

const transform = computed(() => {
  return `transform:translate(0,${startOffset}px,0)`;
});

const visbleCount = computed(() => {
  return Math.ceil(rootClientHeight.value / props.height);
});

const listHeight = computed(() => {
  return props.renderData.length * props.height;
});

const sliceList = computed(() => {
  return props.renderData.slice(
    slicePos.start,
    Math.min(slicePos.end, props.renderData.length)
  );
});

function onScroll() {
  console.log(44);

  const scrollTop = totalList.value?.scrollTop;

  if (scrollTop) {
    slicePos.start = Math.floor(scrollTop / props.height);
    slicePos.end = slicePos.start + visbleCount.value;
    startOffset.value = scrollTop - (scrollTop % props.height);
  }
}

const stopDomInfo = watch(
  () => totalList.value,
  (value) => {
    if (value) {
      nextTick(() => {
        rootClientHeight.value = value.clientHeight;
        slicePos.start = 0;
        slicePos.end = slicePos.start + visbleCount.value;
      });
    }
  }
);

onMounted(() => {});

onUpdated(() => {});

onUnmounted(() => {
  stopDomInfo();
});
</script>
<style scoped lang="scss">
.slider_track::-webkit-scrollbar {
  display: none;
}
</style>
