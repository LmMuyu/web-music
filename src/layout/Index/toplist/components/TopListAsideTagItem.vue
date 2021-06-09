<template>
  <ul class="list-none w-full">
    <li
      v-for="(childItem, index) in navItem.childrenData"
      :key="childItem.id"
      class="flex p-4 cursor-pointer"
      :style="activeStyle(index)"
      @mouseenter="moveActive(index)"
      @mouseleave="leaveActive(index)"
      @click="[childTagItemClick(childItem.id), clickActive(index)]"
    >
      <div class="w-10 h-10">
        <img :src="childItem.coverImgUrl + '?param=40y40'" />
      </div>
      <div class="flex flex-col justify-between ml-4">
        <span>{{ childItem.name }}</span>
        <span class="text-xs text-gray-200">
          {{ childItem.updateFrequency }}
        </span>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { defineProps, ref } from "@vue/runtime-core";

import { activeIndex } from "../../../../utils/activeIndex";
import { getlistDetailData } from "../hooks/request";
import { setContentData } from "../hooks/methods";
import { preloading } from "./hooks/methods";
import { mainMapData } from "../hooks/data";
import { currentID } from "./hooks/data";

const props = defineProps({
  navItem: {
    type: Object,
    default: () => ({}),
  },
});

const childrenData = preloading(props.navItem.childrenData);

async function childTagItemClick(currID: number) {
  if (currentID.value === currID) return;
  currentID.value = currID;

  const mainData = await getlistDetailData(currID, mainMapData);
  setContentData(mainData);
}

const curIndex = ref(0);
const moveIndex = ref(0);

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(
  curIndex,
  moveIndex,
  {
    style: "background",
    moveColor: "#7cbcfc66",
  }
);
</script>
<style scoped lang="scss"></style>
