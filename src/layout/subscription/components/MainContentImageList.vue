<template>
  <ul :style="gridstyle" :class="{ 'mt-6': isMarginTop }" @click.capture="emitPreImage">
    <li v-for="(file, index) in picList" :key="index">
      <img :src="file" class="object-fit" :key-index="index" />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, defineProps, ref } from "vue";

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
</script>
<style scoped lang="scss"></style>
