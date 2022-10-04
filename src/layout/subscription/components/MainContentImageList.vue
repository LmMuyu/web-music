<template>
  <div :style="absoluteBox">
    <div :style="gridstyle" :class="{ 'mt-6': isMarginTop }" class="h-full">
      <ElImage
        v-for="(file, index) in dynamics.picList"
        :preview-src-list="dynamics.previmages"
        :initial-index="index"
        :key="index"
        :src="file + `?parma=${dynamics.w}y${dynamics.h}`"
        loading="lazy"
        :lazy="true"
        :preview-teleported="true"
      >
      </ElImage>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps, PropType, reactive, ref } from "vue";

import { ElImage } from "element-plus";

import { Dynamic, DynamicEvent } from "../methods";

const props = defineProps({
  subinfo: {
    type: Object as PropType<DynamicEvent>,
    required: true,
  },
  isMarginTop: {
    type: Boolean,
    default: () => true,
  },
});

const picList = ref<any[]>([]);

const dynamics = new Dynamic(props.subinfo);
picList.value = dynamics.picList;

const row = computed(() => {
  return Math.ceil(dynamics.picList.length / 3);
});

const gridstyle = computed(() => {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(3,${dynamics.w.value + "px"})`,
    gridTemplateRows: `repeat(${row.value},${dynamics.h.value + "px"})`,
    gridGap: "5px",
  };
});

const absoluteBox = computed(() => {
  // debugger;
  const style = reactive({
    width: 0 + "px",
    height: 0 + "px",
  });

  const gap = 5;
  let imgCount = picList.value.length;
  let wgapCount = imgCount > 3 ? 2 : imgCount - 1;
  const boxwidth = dynamics.w.value * (wgapCount + 1) + gap * wgapCount;
  const boxHeight =
    dynamics.h.value * row.value + gap * (row.value >= 1 ? row.value - 1 : 0);

  style.height = Math.abs(boxHeight) + "px";
  style.width = Math.abs(boxwidth) + "px";

  return style;
});
</script>
<style scoped lang="scss"></style>
