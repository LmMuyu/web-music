<template>
  <div class="flex flex-col w-full h-full">
    <ToplistMainContent :listData="mainConatinerData" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";



import ToplistMainContent from "./components/ToplistMainContent.vue";

import { toplistData } from "../../../api/toplist";
import { getlistDetailData } from "./hooks/request";

import type { NodeAttribute } from "../../../utils/LRUCache"

const props = defineProps({
  seelp: {
    type: Number,
    default: 1,
  },
});

const mainConatinerData = ref<NodeAttribute[]>([])

toplistData()
  .then((list) => {
    const cardlist = list.data.list
    return cardlist.slice(0, 4)
  })
  .then(async (cards: any[]) => {
    mainConatinerData.value = await getlistDetailData(cards.map((c) => c.id))
  });
</script>
<style lang="scss" scoped>
.border {
  box-shadow: 0px 0px 2px #ecf0f1;
}
</style>
