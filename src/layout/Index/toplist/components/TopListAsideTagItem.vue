<template>
  <ul class="list-none w-full">
    <li
      v-for="childItem in navItem.childrenData"
      :key="childItem.id"
      class="flex p-4 cursor-pointer"
      :style="activeStyle(childItem.keyIndex)"
      @mouseenter="moveActive(childItem.keyIndex)"
      @mouseleave="leaveActive(childItem.keyIndex)"
      @click="
        [childTagItemClick(childItem.id), clickActive(childItem.keyIndex)]
      "
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
import { defineProps } from "@vue/runtime-core";

import { activeIndex } from "../../../../utils/activeIndex";
import { getlistDetailData } from "../hooks/request";
import { setContentData } from "../hooks/methods";
import { currentID } from "./hooks/data";
import { getMittBus } from "../../../../utils/mittBus";

const props = defineProps({
  navItem: {
    type: Object,
    default: () => ({}),
  },
});

const mittBus = getMittBus();

async function childTagItemClick(currID: number) {
  if (currentID.value === currID) return;
  currentID.value = currID;

  mittBus.emit("markvrituallist");

  const mainData = await getlistDetailData(currID);
  setContentData(mainData);
}

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(
  null,
  null,
  {
    style: "background",
    enterColor: "#7cbcfc66",
    initColor: "#fff",
  }
);
</script>
<style scoped lang="scss"></style>
