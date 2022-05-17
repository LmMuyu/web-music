<template>
  <div :style="absoluteBox">
    <ul
      :style="gridstyle"
      :class="{ 'mt-6': isMarginTop }"
      class="h-full"
      @click.capture="emitPreImage"
    >
      <li v-for="(file, index) in picList" :key="index">
        <img :src="file" class="object-fit" :key-index="index" />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps, reactive, ref } from "vue";
import { isType } from "../../../utils/methods";

import { Dynamic } from "../methods";

const ctxEmit = defineEmits(["preImage"]);

const props = defineProps({
  subinfo: {
    type: Object,
    required: true,
  },
  isMarginTop: {
    type: Boolean,
    default: () => true,
  },
});

const picList = ref<any[]>([]);

const dynamics = new Dynamic(props.subinfo);

Promise.resolve().then(() => (picList.value = dynamics.picList));

function emitPreImage(e: Event) {
  const target = e.target as HTMLElement;

  if (target.nodeName === "IMG") {
    ctxEmit("preImage", target.getAttribute("key-index"));
  }
}

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
  debugger;
  const style = reactive({
    width: 0 + "px",
    height: 0 + "px",
  });

  const gap = 5;

  Promise.resolve().then(() => {
    if (isType(picList.value) === "Array") {
      let imgCount = picList.value.length;
      let wgapCount = imgCount > 3 ? 2 : imgCount - 1;
      const boxwidth = dynamics.w.value * (wgapCount + 1) + gap * wgapCount;
      const boxHeight = dynamics.h.value * (row.value - 1) + gap * (row.value - 1);

      console.log(boxwidth);
      console.log(boxHeight);

      style.height = Math.abs(boxHeight) + "px";
      style.width = Math.abs(boxwidth) + "px";
    }
  });

  return style;
});
</script>
<style scoped lang="scss"></style>
