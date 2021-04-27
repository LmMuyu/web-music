<template>
  <el-row class="mt-24">
    <el-col :span="4"> </el-col>
    <el-col :span="16">
      <div class="flex">
        <nav class="shadow w-1/5 pb-7">
          <ul
            class="list-none"
            v-for="(navItem, mainTag) in listTitle"
            :key="mainTag"
          >
            <li>
              <div class="ml-6 py-6 text-xl">{{ navItem.title }}</div>
              <ul class="list-none">
                <li
                  v-for="childItem in navItem.childrenData"
                  :key="childItem.id"
                  class="flex p-4"
                  :class="{
                    'bg-gray-300': currentID === childItem.id,
                  }"
                  @mouseenter="onMouseenter"
                  @mouseleave="onMouseleave"
                  @click="childTagItemClick(childItem.id)"
                >
                  <div>
                    <img :src="childItem.coverImgUrl + '?param=40y40'" alt="" />
                  </div>
                  <div class="flex flex-col justify-between ml-4">
                    <span>{{ childItem.name }}</span>
                    <span class="text-xs text-gray-400">{{
                      childItem.updateFrequency
                    }}</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div></div>
      </div>
    </el-col>
    <el-col :span="4"> </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { allToplist, getlistDetailData } from "./hooks/request";
import { onMouseenter, onMouseleave } from "./hooks/methods";
import type { ListTitle } from "./types/dataType";
import { ElRow, ElCol } from "element-plus";
import type { DATA } from "./types/index";
import setupData from "./hooks/data";
import { ref } from "@vue/reactivity";

const renderData = ((setupData as unknown) as DATA).setup();

const { listTitle, mainMapData } = renderData;
const currentID = ref<null | number>(null);

function childTagItemClick(currID: number) {
  if (currentID.value === currID) return;
  currentID.value = currID;
}

allToplist()
  .then((list) => {
    (listTitle as ListTitle).cloud.childrenData = list.cloud.childrenData;
    (listTitle as ListTitle).global.childrenData = list.global.childrenData;

    const childItem = list.cloud.childrenData[0];
    currentID.value = childItem.id;

    return childItem;
  })
  .then((item) => {
    getlistDetailData(item.id, mainMapData);
  });
</script>
<style lang="scss" scoped>
.border {
  box-shadow: 0px 0px 2px #ecf0f1;
}
</style>
