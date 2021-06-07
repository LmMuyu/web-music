<template>
  <ul class="list-none w-full">
    <li
      v-for="childItem in navItem.childrenData"
      :key="childItem.id"
      class="flex p-4 cursor-pointer"
      :class="{
        'bg-gray-300': currentID === childItem.id,
      }"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      @click="childTagItemClick(childItem.id)"
    >
      <div>
        <img :src="childItem.coverImgUrl + '?param=40y40'" />
      </div>
      <div class="flex flex-col justify-between ml-4">
        <span>{{ childItem.name }}</span>
        <span class="text-xs text-gray-400">
          {{ childItem.updateFrequency }}
        </span>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";

import { onMouseenter, onMouseleave, setContentData } from "../hooks/methods";
import { getlistDetailData } from "../hooks/request";
import { mainMapData } from "../hooks/data";
import { currentID } from "./hooks/data";

const props = defineProps({
  navItem: {
    type: Object,
    default: () => ({}),
  },
});

async function childTagItemClick(currID: number) {
  if (currentID.value === currID) return;
  currentID.value = currID;

  const mainData = await getlistDetailData(currID, mainMapData);
  setContentData(mainData);
}
</script>
<style scoped lang="scss"></style>
