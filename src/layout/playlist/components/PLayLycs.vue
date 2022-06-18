<template>
  <div
    class="pointer-events-auto relative transform-gpu transition-all px-14"
    :style="musicTextContainerStyle"
    @mouseover="showCurTimeEvent"
    @mouseleave="showTimeIndex = null"
    ref="scrollNode"
    @click="selectLycs"
  >
    <div
      v-for="(musicItem, index) in musicItemList"
      :key="musicItem.playTime"
      class="flex items-center py-3 relative"
      :lycs-key="musicItem.indexId"
    >
      <div class="flex items-center">
        <transition
          v-if="showTimeIndex == index"
          enter-active-class="active"
          enter-to-class="enterTo"
          leave-active-class="active"
          leave-to-class="leaveTo"
        >
          <div class="flex items-center transform -translate-x-full absolute left-0">
            <span class="ml-4 text-sm">{{ musicItem.originTime }}</span>
            <div class="left_line"></div>
          </div>
        </transition>
        <span
          class="text-sm text-left cursor-pointer whitespace-nowrap text_color"
          :lycplaytime="musicItem.originTime"
          :node_id="musicItem.playTime"
          :lycs-key="musicItem.indexId"
          :keyid="index"
        >
          {{ musicItem.lyc }}
        </span>
        <transition
          v-if="showTimeIndex == index"
          enter-active-class="active"
          enter-to-class="enterTo"
          leave-active-class="active"
          leave-to-class="leaveTo"
        >
          <div class="flex items-center">
            <div class="right_line"></div>
            <font-icon size="16" icon="iconmore"></font-icon>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, PropType, computed, unref, ref } from "vue";

import { distance, lyricNodeRect } from "../hooks/data";

import FontIcon from "../../../components/fonticon/FontIcon.vue";

import type { MatchItem } from "../type";

const props = defineProps({
  musicItemList: {
    type: Array as PropType<MatchItem[]>,
    required: true,
  },
});

const showTimeIndex = ref(null);
const scrollNode = ref<HTMLElement | null>(null);

function showCurTimeEvent(e: Event) {
  const target = e.target as HTMLElement;
  const curIndex = target.getAttribute("keyid");
  showTimeIndex.value = curIndex;
}

function distanceTranslateY() {
  setInterval(() => {
    distance.value += 44;
  }, 1000);
}

// distanceTranslateY()

function selectLycs(e: Event) {
  const target = e.target as HTMLElement;

  if (target.hasAttribute("lycs-key")) {
  
  } else {
    console.log("找不到lycs-key");
  }
}

const musicTextContainerStyle = computed(() => {
  return {
    transform: `translate(0,${-unref(distance)}px) translateZ(0)`,
  };
});

onMounted(async () => {
  await nextTick();
  lyricNodeRect.scrollHeight = scrollNode.value.scrollHeight;
  console.log("PLayLycs" + lyricNodeRect.scrollHeight);
});
</script>
<style scoped lang="scss">
@mixin LineBorder() {
  width: 20px;
  height: 0;
  border: 1px solid #3a3a59;
  background-image: linear-gradient(left);
}

div {
  transition: all 0.1s linear;
}

.active {
  transition: all 0.2s ease;
}

.enterTo {
  opacity: 1;
}

.leaveTo {
  opacity: 0;
}

.text_color:hover {
  color: #3a3a59;
}

.left_line {
  @include LineBorder;
}

.right_line {
  @include LineBorder;
}
</style>
