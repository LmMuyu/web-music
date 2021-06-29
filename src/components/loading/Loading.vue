<template>
  <div class="w-full h-full flex justify-center items-center">
    <svg width="40" height="40" fill="none">
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke-dasharray="138"
        stroke-dashoffset="100"
        transform="rotate(0,20,20)"
        style="stroke: #74b9ff; stroke-width: 3px"
        ref="innerCircle"
      ></circle>
      <circle
        cx="20"
        cy="20"
        r="15"
        stroke-dasharray="138"
        stroke-dashoffset="110"
        transform="rotate(-180,20,20)"
        style="stroke: #74b9ff; stroke-width: 3px"
        ref="outerRing"
      ></circle>
    </svg>
  </div>
</template>
<!-- preloader -->
<script setup lang="ts">
import { ref, unref } from "@vue/reactivity";

import type { Ref } from "vue";

const innerCircle = ref<HTMLElement | null>(null);
const outerRing = ref<HTMLElement | null>(null);

const transformRotate = (el: Ref<HTMLElement | null>) => {
  if (!unref(el)) return;

  const deg = 0;
};
</script>
<style scoped lang="scss">
.holder {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
