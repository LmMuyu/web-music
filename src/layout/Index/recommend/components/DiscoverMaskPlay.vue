<template>
  <div
    class="mask_play flex justify-center items-center cursor-pointer"
    v-if="activeCurrent === index"
  >
    <svg width="32" height="32">
      <circle
        cx="16"
        cy="16"
        r="15"
        stroke="#eaeff1"
        stroke-width="2"
        fill="none"
        class="flex justify-center items-center"
      ></circle>

      <polygon
        points="28,16 10,6 10,26"
        style="fill: none; stroke: #fff; stroke-width: 2"
      />
    </svg>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";
import { activeCurrent } from "../api/data";

import type { PropType } from "vue";

const props = defineProps({
  index: {
    type: [String, Number, Symbol] as PropType<keyof any>,
    required: true,
  },
});
</script>
<style scoped lang="scss">
$size: 100;

.mask_play {
  position: absolute;
  top: 0;
  bottom: 0;
  width: $size +#{"%"};
  height: $size +#{"%"};
  background: rgb(99, 110, 114, 0.5);
  z-index: 9;
}
</style>
