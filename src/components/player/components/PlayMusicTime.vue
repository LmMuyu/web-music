<template>
  <div class="flex items-center w-full h-full" :class="class">
    <div class="px-1">
      <CalculationTime :time="starttime"></CalculationTime>
    </div>
    <div class="px-1 w-full">
      <slot></slot>
    </div>
    <div class="px-1">
      <CalculationTime :time="maxtime"></CalculationTime>
    </div>
  </div>
</template>
<script setup lang='ts'>
import CalculationTime from './CalculationTime.vue';

const props = defineProps({
  starttime: {
    type: Number,
    required: true
  },
  maxtime: {
    type: Number,
    required: true
  },
  class: {
    type: String,
    default: ""
  }
})
</script>
<style scoped lang='scss'>
</style>