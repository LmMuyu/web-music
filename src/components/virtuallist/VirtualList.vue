<template>
  <div
    class="relative overflow-auto slider_track"
    @scroll="onScroll"
    ref="totalList"
  >
    <div
      class="absolute top-0 right-0 h-8 w-2"
      :style="{ height: listHeight + 'px' }"
      ref="bar_track"
    ></div>
    <ul
      class="flex flex-col"
      :style="{
        height: scrollHeight === 0 ? '100%' : scrollHeight + 'px',
        transform: offsetTranslate,
      }"
      ref="listItem"
    >
      <li
        v-for="renderItem in sliceList"
        :key="renderItem[keyindex]"
        class="flex items-center h-auto w-auto"
        :_id="renderItem[keyindex]"
      >
        <slot
          :scopeData="{ renderItem, index: renderItem[keyindex], keyindex }"
        ></slot>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  nextTick,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  watch,
} from "@vue/runtime-core";

import { getEachEstimateInfo } from "./hooks/methods";

import type { PropType } from "vue";
import type { EstimateType } from "./type";

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
  aftterBuffer: {
    type: Number,
    default: 4,
  },
  scrollHeight: {
    type: Number,
    default: 0,
  },
  keyindex: {
    type: String,
    required: true,
  },
});

const slicePos = reactive({
  start: 0,
  end: 0,
});

const totalList = ref<HTMLElement | null>(null);
const listItem = ref<HTMLElement | null>(null);
const bar_track = ref<HTMLElement | null>(null);
const estimateList = ref<EstimateType[]>([]);
const rootClientHeight = ref(0);
const startOffset = ref(0);

estimateList.value = getEachEstimateInfo(props.height, props.renderData);

const rendWatch = watch(
  () => props.renderData,
  (value) => {
    estimateList.value = getEachEstimateInfo(props.height, value);
    setBarTrack();
    rendWatch();
  }
);

const rootStep = watch(totalList, (value) => {
  if (!value) return;
  rootClientHeight.value = value.clientHeight;
  rootStep();
});

const offsetTranslate = computed(() => {
  return `translate(0,${startOffset.value}px) translateZ(0)`;
});

const visbleCount = computed(() => {
  console.log(rootClientHeight.value);

  return Math.ceil(rootClientHeight.value / props.height);
});

const listHeight = computed(() => {
  if (estimateList.value.length === 0) return 0;

  return estimateList.value[estimateList.value.length - 1].bottom || 0;
});

const sliceList = computed(() => {
  const start = slicePos.start;
  const end = Math.min(slicePos.end, props.renderData.length);

  return props.renderData.slice(start, end);
});

const beforCount = computed(() => {
  return Math.min(slicePos.start, props.beforBuffer);
});

const aftterCount = computed(() => {
  return Math.min(props.renderData.length - slicePos.end, props.aftterBuffer);
});

function onScroll() {
  const scrollTop = totalList.value?.scrollTop;

  if (scrollTop) {
    slicePos.start = searchStartIndex(scrollTop);
    slicePos.end = slicePos.start + visbleCount.value;

    setStartOffset();
  }
}

function setStartOffset() {
  if (slicePos.start >= 1) {
    startOffset.value = estimateList.value[slicePos.start - 1].bottom || 0;
    console.log(estimateList.value);
  } else {
    startOffset.value = 0;
  }

  if (slicePos.start - props.beforBuffer === 1) {
    slicePos.start = 0;
  }
}

function setBarTrack() {
  if (!bar_track.value || !estimateList.value.length) return;

  const height = estimateList.value[estimateList.value.length - 1].bottom;
  bar_track.value.style.height = height + "px";
}

const watchDomInfo = (value: HTMLElement | null) => {
  if (!value) return;
};

const stopDomInfo = watch(totalList, watchDomInfo);

function searchStartIndex(scrollTop: number = 0) {
  return binarySearch(scrollTop, estimateList.value);
}

function binarySearch(value: number, position: EstimateType[]) {
  let start = 0;
  let end = position.length - 1;
  let tempIndex = 0;

  while (start <= end) {
    const mid = (start + end) >>> 1;
    const midvalue = position[mid].bottom;

    if (midvalue === value) {
      return mid;
    } else if (midvalue < value) {
      start = mid + 1;
    } else if (midvalue > value) {
      if (tempIndex === 0 || tempIndex > mid) {
        tempIndex = mid;
      }

      end = mid - 1;
    }
  }

  return tempIndex;
}

function updateItemsSize() {
  // console.log(estimateList.value);

  if (listItem.value && listItem.value.children.length) {
    const listDom = listItem.value.children as unknown as HTMLElement[];

    listDom.forEach((node) => {
      const estimate = estimateList.value;
      console.log(node);

      const height = node.getBoundingClientRect().height;
      const index = +node.getAttribute("_id")!;

      const oldHeight = estimate[index].height;
      const vdiff = oldHeight - height;

      if (vdiff) {
        estimate[index].bottom = estimate[index].bottom - vdiff;
        estimate[index].height = height;

        for (let k = index + 1; k < listDom.length; k++) {
          estimate[k].top = estimate[k - 1].bottom;
          estimate[k].bottom = estimate[k].bottom - vdiff;
        }
      }
    });
  }
}

onMounted(() => {
  nextTick().then(() => {
    rootClientHeight.value = totalList.value?.clientHeight || 0;
    slicePos.start = 0;
    slicePos.end = slicePos.start + visbleCount.value;
  });
});

onUpdated(() => {
  nextTick(() => {
    updateItemsSize();
    setBarTrack();
  });
});

onUnmounted(() => {
  stopDomInfo();
});
</script>
<style scoped lang="scss">
.slider_track::-webkit-scrollbar {
  display: none;
}
</style>
