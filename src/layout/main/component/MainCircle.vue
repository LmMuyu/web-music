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
  let degrees = 0;

  render(ctx);

  // function raf() {
  //   degrees += 10;

  //   if (degrees > 360) {
  //     degrees = 0;
  //   }
  //   update(ctx, degrees);
  //   raftimer = requestAnimationFrame(raf);
  // }

  // raf();

  setTimeout(() => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.rotate((100 * Math.PI) / 180);
    render(ctx);
  }, 5000);
}

function render(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(150, 150, 12, 0, 1.5 * Math.PI);
  ctx.strokeStyle = "#74b9ff";
  ctx.stroke();
}

function update(ctx: CanvasRenderingContext2D, degrees: number) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.rotate((degrees * Math.PI) / 180);
  render(ctx);
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
