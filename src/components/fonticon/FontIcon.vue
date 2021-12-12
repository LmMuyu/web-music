<template>
  <span>
    <slot name="before"></slot>
    <i :style="fonticon" :class="icon" class="cursor-pointer"></i>
    <slot name="after"></slot>
  </span>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#607d8b",
  },
  size: {
    type: String,
    default: "16",
  },
});

const fonticon = computed(() => {
  return `
      font-family:"iconfont" !important;
      font-size:${props.size}px;
      color:${props.color};
      font-style:normal;
      -webkit-font-smoothing: antialiased;
      -webkit-text-stroke-width: 0.2px;
      -moz-osx-font-smoothing: grayscale;
  `;
});
</script>
<style scoped lang="scss"></style>
