<template>
  <ul class="grid" :class="{ 'mt-6': isMarginTop }">
    <li v-for="(file, index) in picList" :key="index">
      <img :src="file" class="object-fit" />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, defineProps, ref } from "vue";

import type { PropType } from "vue";
import axios from "axios";

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

const row = computed(() => {
  return Math.ceil(props.pics.length / 3);
});
</script>
<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(v-bind(row), 100px);
  grid-gap: 2px;
}
</style>
