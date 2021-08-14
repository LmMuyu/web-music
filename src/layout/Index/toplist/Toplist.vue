<template>
  <div class="flex flex-col w-full h-full">
    <ToplistMainHeader :listData="mainShowData" />
    <ToplistMainContent :listData="mainShowData[0]?.tracks" />
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";

import { allToplist, getlistDetailData } from "./hooks/request";
import { mainShowData, listTitle } from "./hooks/data";
import { currentID } from "./components/hooks/data";
import { setContentData } from "./hooks/methods";

import ToplistMainContent from "./components/ToplistMainContent.vue";
import ToplistMainHeader from "./components/ToplistMainHeader.vue";

import type { ListTitle as typeListTitle } from "./types/dataType";

const props = defineProps({
  seelp: {
    type: Number,
    default: 1,
  },
});

allToplist()
  .then((list) => {
    (listTitle as typeListTitle).cloud.childrenData = list.cloud.childrenData;
    (listTitle as typeListTitle).global.childrenData = list.global.childrenData;

    const childItem = list.cloud.childrenData[0];
    currentID.value = childItem.id;

    return childItem;
  })
  .then(async (item) => {
    const mainData = await getlistDetailData(item.id);
    setContentData(mainData);
  });
</script>
<style lang="scss" scoped>
.border {
  box-shadow: 0px 0px 2px #ecf0f1;
}
</style>
