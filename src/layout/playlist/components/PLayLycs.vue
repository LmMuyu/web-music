<template>
  <div
    class="pointer-events-auto relative transition"
    :style="musicTextContainerStyle"
    @mouseover="showCurTimeEvent"
    @mouseleave="showTimeIndex = null"
    ref="scrollNode"
  >
    <span
      v-for="(musicItem, index) in musicItemList"
      :key="musicItem.playTime"
      class="flex items-center"
    >
      <p
        class="py-3 text-sm text-left cursor-pointer text_color"
        :lycplaytime="musicItem.originTime"
        :node_id="musicItem.playTime"
        :keyid="index"
      >{{ musicItem.lyc }}</p>

      <transition v-if="showTimeIndex == index" name="feide">
        <p class="ml-4">-{{ musicItem.originTime }}</p>
      </transition>
    </span>
  </div>
</template>
<script setup lang='ts'>
import { computed, unref, ref } from 'vue-demi';

import { distance } from '../hooks/data';

import type { PropType } from "vue"
import type { MatchItem } from '../type';

const props = defineProps({
  musicItemList: {
    type: Array as PropType<MatchItem[]>,
    required: true
  }
})

const showTimeIndex = ref(null)
const scrollNode = ref<HTMLElement | null>(null)

function showCurTimeEvent(e: Event) {
  const target = e.target as HTMLElement
  const curIndex = target.getAttribute("keyid")

  showTimeIndex.value = curIndex
}

const musicTextContainerStyle = computed(() => {
  return {
    transform: `translate(0,${-unref(distance)}px) translateZ(0)`
  }
})

</script>
<style scoped lang='scss'>
div {
  transition: all 0.1s linear;
}
.feide-enter-active,
.feide-leave-active {
  transition: all 0.2s ease;
}

.feide-enter-from,
.feide-leave-to {
  opacity: 0;
}

.feide-enter-to,
.feide-leave-from {
  opacity: 1;
}
</style>