<template>
  <div :class="class" class="flex justify-between items-center images">
    <div
      v-for="(path, index) in list"
      :key="index"
      :style="{ width: `${width}px`, height: `${height}px` }"
    >
      <div class="w-full h-full">
        <img
          :src="path"
          :style="{ minWidth: `${width}px`, minHeight: `${height}px` }"
          class="object-cover"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  class: String,
  list: {
    type: Array as PropType<any[]>,
    required: true,
  },
  width: {
    type: Number,
    default: 128,
  },
  height: {
    type: Number,
    default: 128,
  },
});
</script>
<style scoped lang="scss"></style>
