<template>
  <el-slider
    ref="slider"
    v-model="starttime"
    :min="mintime"
    :max="maxtime"
    :show-tooltip="false"
    @input="_throttle"
  ></el-slider>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";

import { throttle } from "../../../utils/throttle";

import { ElSlider } from "element-plus";

const ctxEmit = defineEmits(["input", "change"]);

const props = defineProps({
  starttime: {
    type: Number,
    required: true,
  },
  mintime: {
    type: Number,
    required: true,
  },
  maxtime: {
    type: Number,
    required: true,
  },
});

const slider = ref<typeof ElSlider>(null);

function alterSliderStyle() {
  const sliderNode = slider.value.$el as HTMLElement;
  const sliderButton = sliderNode.querySelector(".el-slider__button") as HTMLElement;

  sliderButton.style.cssText = `
    width:10px;
    height:10px
 `;
}

const _throttle = throttle((pos: number) => ctxEmit("input", pos));
onMounted(() => nextTick(() => alterSliderStyle()));
</script>
))
<style scoped lang="scss"></style>
