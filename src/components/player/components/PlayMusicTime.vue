<template>
  <ElRow class="flex items-center w-full h-full" :class="class">
    <ElCol :span="3" class="px-1 h-full relative">
      <div class="flex items-center h-full absolute top-0 left-0">
        <CalculationTime :time="starttime"></CalculationTime>
      </div>
    </ElCol>
    <ElCol :span="18" class="px-1 w-full">
      <slot></slot>
    </ElCol>
    <ElCol :span="3" class="px-1 h-full relative">
      <div class="flex items-center h-full absolute right-0 top-0">
        <CalculationTime :time="maxtime"></CalculationTime>
      </div>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import CalculationTime from "./CalculationTime.vue";
import { ElRow, ElCol } from "element-plus";

const props = defineProps({
  starttime: {
    type: Number,
    required: true,
  },
  maxtime: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    default: "",
  },
});
</script>
<style scoped lang="scss"></style>
