<template>
  <div class="w-full h-full flex justify-center items-center">
    <svg width="38" height="38" fill="none">
      <circle
        cx="19"
        cy="19"
        r="12"
        stroke-dasharray="75"
        stroke-dashoffset="52"
        transform="rotate(-180,20,20)"
        style="stroke: #74b9ff; stroke-width: 2px"
        ref="outerRing"
      ></circle>
      <circle
        cx="19"
        cy="19"
        r="16"
        stroke-dasharray="100"
        stroke-dashoffset="70"
        transform="rotate(0,20,20)"
        style="stroke: #74b9ff; stroke-width: 2px"
        ref="innerCircle"
      ></circle>
    </svg>
  </div>
</template>
<!-- preloader -->
<script setup lang="ts">
import { ref, unref } from "@vue/reactivity";
import { nextTick, onMounted, onUnmounted } from "vue";

import type { Ref } from "vue";

const innerCircle = ref<HTMLElement | null>(null);
const outerRing = ref<HTMLElement | null>(null);
const rafStep = {
  innerCircle: 0,
  outerRing: 0,
};

const rafRotate = (
  el: HTMLElement | null,
  rotate: number,
  x: number,
  y: number,
  mode: "inverse" | "shun",
  form: "innerCircle" | "outerRing"
) => {
  if (Math.abs(rotate) > 360) {
    rotate = 0;
  }

  rotate += mode === "inverse" ? -6 : 6;
  el?.setAttribute("transform", `rotate(${rotate},${x},${y})`);

  rafStep[form] = requestAnimationFrame(() =>
    rafRotate(el, rotate, x, y, mode, form)
  );
};

const transformRotate = (
  el: Ref<HTMLElement | null>,
  mode: "inverse" | "shun" = "shun",
  form: "innerCircle" | "outerRing"
) => {
  if (!unref(el)) return;
  let deg = 0;

  const rotateInfo = (
    el.value?.getAttribute("transform")?.match(/\d{1,3}/g) || []
  ).map(Number);

  deg = rotateInfo[0] || 0;
  rafRotate(el.value, deg, rotateInfo[1], rotateInfo[2], mode, form);
};

onMounted(() => {
  nextTick().then(() => {
    transformRotate(innerCircle, "shun", "innerCircle");
    transformRotate(outerRing, "inverse", "outerRing");
  });
});

onUnmounted(() => {
  //@ts-ignore
  Object.keys(rafStep).forEach((key) => cancelAnimationFrame(rafStep[key]));
});
</script>
<style scoped lang="scss">
.holder {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
