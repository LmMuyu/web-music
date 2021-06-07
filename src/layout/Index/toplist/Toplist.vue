<template>
  <div class="flex flex-col w-full h-full mx-8">
    <ToplistMainHeader :listData="mainShowData" />
    <ToplistMainContent :listData="mainShowData[0]?.tracks" />
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps, nextTick, onMounted } from "@vue/runtime-core";

import {
  rowRoot,
  mainShowData,
  listTitle,
  mainMapData,
  elementScrollTop,
  rowTop,
} from "./hooks/data";
import { allToplist, getlistDetailData } from "./hooks/request";
import { currentID } from "./components/hooks/data";
import { setContentData, setTransition } from "./hooks/methods";

import ToplistMainHeader from "./components/ToplistMainHeader.vue";
import ToplistMainContent from "./components/ToplistMainContent.vue";

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
    const mainData = await getlistDetailData(item.id, mainMapData);
    setContentData(mainData);
  });

function documentScroll() {
  const documentScrollTop = document.documentElement.scrollTop;

  elementScrollTop.value = documentScrollTop;
}

function setTranY(Yvalue: number) {
  return `translate(0,${Yvalue}px) translateZ(0)`;
}

const setTransformY = computed(() => setTranY(elementScrollTop.value));

// onMounted(() => {
//   nextTick().then(() => {
//     rowTop.value = rowRoot.value?.offsetTop || 0;
//     setTransition(rowRoot.value!, 1, props.seelp);
//   });
// });
</script>
<style lang="scss" scoped>
.border {
  box-shadow: 0px 0px 2px #ecf0f1;
}
</style>
