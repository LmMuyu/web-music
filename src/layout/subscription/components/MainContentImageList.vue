<template>
  <ul :style="gridstyle" :class="{ 'mt-6': isMarginTop }" @click.capture="emitPreImage">
    <li v-for="(file, index) in picList" :key="index">
      <img :src="file" class="object-fit" :key-index="index" />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, defineProps, ref } from "vue";

import type { PropType } from "vue";

const ctxEmit = defineEmits(["preImage"]);

const props = defineProps({
  pics: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  isMarginTop: {
    type: Boolean,
    default: () => true,
  },
});

const picList = ref<any[]>([]);
const w = ref(100);
const h = ref(100);

async function toFileReader(fileList: any[]) {
  const len = fileList.length;
  if (len === 0) return;

  switch (len) {
    case 1:
      w.value += w.value * 2;
      h.value += h.value * 2;
      break;
    case 2:
      w.value += w.value * 1.5;
      h.value += h.value * 1.5;
      break;
  }

  return fileList.map((pic) => pic.originUrl + `?param=${w.value}y${h.value}`);
}

toFileReader(props.pics).then((res) => (picList.value = res));

function emitPreImage(e: Event) {
  const target = e.target as HTMLElement;

  if (target.nodeName === "IMG") {
    ctxEmit("preImage", target.getAttribute("key-index"));
  }
}

const row = computed(() => {
  return Math.ceil(props.pics.length / 3);
});

const gridstyle = computed(() => {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(3,${w.value + "px"})`,
    gridTemplateRows: `repeat(${row.value},${h.value + "px"})`,
    gridGap: "5px",
  };
});
</script>
<style scoped lang="scss"></style>
