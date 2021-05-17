<template>
  <div ref="rowRoot" :style="{ transform: setTransformY }">
    <el-row class="mt-24">
      <el-col :span="4"></el-col>
      <el-col :span="16">
        <div class="flex">
          <nav class="shadow w-1/5 pb-7">
            <ul class="list-none" v-for="(navItem, mainTag) in listTitle" :key="mainTag">
              <li>
                <div class="ml-6 py-6 text-xl">{{ navItem.title }}</div>
                <ul class="list-none">
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
                        {{
                          childItem.updateFrequency
                        }}
                      </span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          <div class="flex flex-col w-full mx-8">
            <ToplistMainHeader :listData="mainShowData" />
            <ToplistMainContent :listData="mainShowData[0]?.tracks" />
          </div>
        </div>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
//@ts-ignore
import ToplistMainHeader from "./components/ToplistMainHeader.vue";
//@ts-ignore
import ToplistMainContent from "./components/ToplistMainContent.vue";
import { ElRow, ElCol } from "element-plus";

import { ref } from "@vue/reactivity";
import {
  computed,
  defineProps,
  nextTick,
  onMounted,
} from "@vue/runtime-core";

import setupData from "./hooks/data";
import { onMouseenter, onMouseleave } from "./hooks/methods";
import { allToplist, getlistDetailData } from "./hooks/request";

import type { DATA } from "./types/index";
import type { ListTitle } from "./types/dataType";
import type { ListItem } from "./types/requestType";

const props = defineProps({
  seelp: {
    type: Number,
    default: 1,
  },
});

const renderData = ((setupData as unknown) as DATA).setup();

const { listTitle, elementScrollTop, mainMapData, rowTop } = renderData;
const currentID = ref<null | number>(null);
const mainShowData = ref<ListItem[]>([]);
const rowRoot = ref<HTMLElement | null>(null);

async function childTagItemClick(currID: number) {
  if (currentID.value === currID) return;
  currentID.value = currID;

  const mainData = await getlistDetailData(currID, mainMapData);
  setContentData(mainData);
}

allToplist()
  .then((list) => {
    (listTitle as ListTitle).cloud.childrenData = list.cloud.childrenData;
    (listTitle as ListTitle).global.childrenData = list.global.childrenData;

    const childItem = list.cloud.childrenData[0];
    currentID.value = childItem.id;

    return childItem;
  })
  .then(async (item) => {
    const mainData = await getlistDetailData(item.id, mainMapData);
    // console.log(mainData);

    setContentData(mainData);
  });

function setContentData(mainData: ListItem[] | undefined) {
  if (!mainData) return;

  mainData && (mainShowData.value = mainData);
  nextTick(() => {
    setTransition(1);
    elementScrollTop.value = 0;
  });
}

function documentScroll() {
  const documentScrollTop = document.documentElement.scrollTop;
  // const translateY = rowTop.value - documentScrollTop;

  // console.log(translateY);

  // if (translateY <= 0) {
  // console.log(documentScrollTop);

  elementScrollTop.value = documentScrollTop;

  // }
}

function setTransition(duration: number) {
  duration = duration ? duration : props.seelp;

  if (rowRoot.value) {
    rowRoot.value.style.transitionDuration = duration + "s";
    rowRoot.value.style.transitionTimingFunction = "ease-in-out";
    rowRoot.value.style.transitionProperty = "translateY";
  }
}

function setTranY(Yvalue: number) {
  return `translate(0,${Yvalue}px) translateZ(0)`;
}

const setTransformY = computed(() => setTranY(elementScrollTop.value));

onMounted(() => {
  nextTick().then(() => {
    rowTop.value = rowRoot.value?.offsetTop;
    setTransition(1)
  });
});
</script>
<style lang="scss" scoped>
.border {
  box-shadow: 0px 0px 2px #ecf0f1;
}
</style>
