<template>
  <ul ref="refGrid" :class="{ 'mt-6': isMarginTop }">
    <li v-for="(file, index) in picList" :key="index">
      <img :src="file" class="object-fit" :key-index="index" />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, defineProps, nextTick, ref } from "vue";
import axios from "axios";

import type { PropType } from "vue";

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
const refGrid = ref<HTMLElement | null>(null);
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

  setStyle();

  const pics = await Promise.all(
    fileList.map((pic) => {
      return axios({
        method: "get",
        url: pic.originUrl + `?param=${w.value}y${h.value}`,
        responseType: "blob",
      });
    })
  );

  return pics.map((picBlob) => URL.createObjectURL(picBlob.data));
}

toFileReader(props.pics).then((res) => (picList.value = res));

function setStyle() {
  nextTick().then(() => {
    if (refGrid.value) {
      const el = refGrid.value;

      el.style.display = "grid";
      el.style.gridTemplateColumns = `repeat(3,${w.value + "px"})`;
      el.style.gridTemplateRows = `repeat(${row.value},${h.value + "px"})`;
      el.style.gridGap = "5px";
    }
  });
}

const row = computed(() => {
  return Math.ceil(props.pics.length / 3);
});
</script>
<style scoped lang="scss"></style>
