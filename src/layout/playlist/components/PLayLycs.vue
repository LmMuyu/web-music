<template>
  <div
    class="pointer-events-auto relative transition"
    :style="musicTextContainerStyle"
    @mouseover="showCurTimeEvent"
    @mouseleave="showTimeIndex = null"
    ref="scrollNode"
  >
    <div
      v-for="(musicItem, index) in musicItemList"
      :key="musicItem.playTime"
      class="flex items-center py-3"
    >
      <transition
        v-if="showTimeIndex == index"
        enter-active-class="active"
        enter-to-class="enterTo"
        leave-active-class="active"
        leave-to-class="leaveTo"
      >
        <span class="ml-4">{{ musicItem.originTime }}</span>
        <div class="bgrad"></div>
      </transition>
      <span
        class="text-sm text-left cursor-pointer text_color"
        :lycplaytime="musicItem.originTime"
        :node_id="musicItem.playTime"
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
        >
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, unref, ref } from "vue-demi";

import { distance } from "../hooks/data";

import type { PropType } from "vue";
import type { MatchItem } from "../type";

const props = defineProps({
  musicItemList: {
    type: Array as PropType<MatchItem[]>,
    required: true,
  },
});

console.log(props.musicItemList);

const showTimeIndex = ref(null);
const scrollNode = ref<HTMLElement | null>(null);

function showCurTimeEvent(e: Event) {
  const target = e.target as HTMLElement;
  const curIndex = target.getAttribute("keyid");

  showTimeIndex.value = curIndex;
}

const musicTextContainerStyle = computed(() => {
  return {
    transform: `translate(0,${-unref(distance)}px) translateZ(0)`,
  };
});
</script>
<style scoped lang="scss">
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

.bgrad{
  background-image: linear-gradient(left,);
}
</style>
