<template>
  <section class="w-full h-full flex items-center justify-center">
    <canvas width="300" height="300" ref="canvas"></canvas>
  </section>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref } from "@vue/runtime-dom";

const canvas = ref<HTMLCanvasElement>();
let raftimer = null;

function createCircle(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  let radius = 0;

  function raf() {
    radius += 0.05;

    if (radius > 2) {
      radius = 0;
    }
    update(ctx, radius);
    raftimer = requestAnimationFrame(raf);
  }

  raf();
}

function update(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.beginPath();
  ctx.arc(150, 150, 12, 0, radius * Math.PI);
  ctx.strokeStyle = "#74b9ff";
  ctx.stroke();
}

onMounted(() => {
  nextTick(() => {
    const cnavasNode = canvas.value;
    createCircle(cnavasNode);
  });
});

onUnmounted(() => {
  cancelAnimationFrame(raftimer);
  raftimer = null;
});
</script>
