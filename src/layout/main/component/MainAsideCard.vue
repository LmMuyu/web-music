<template>
  <component :infoData="infoData" :is="modelComp" />
  <ElRow class="w-full mr-8 mt-4 cursor-pointer">
    <MainInfoCard :infoData="infoData" />
    <ElCol :span="8" class="flex items-center justify-end icons">
      <i class="iconfont icongengduo-copy" @click="openLoginModel"></i>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import {
  defineAsyncComponent,
  defineProps,
  shallowRef,
} from "@vue/runtime-core";

import { ElCol, ElRow } from "element-plus";
import MainInfoCard from "./MainInfoCard.vue";
const MainModel = defineAsyncComponent(() => import("./MainModel.vue"));

const props = defineProps({
  infoData: {
    type: Object,
    default: () => ({}),
  },
});

let modelComp = shallowRef(MainModel);

function openLoginModel() {
  modelComp.value = MainModel;
}
</script>

<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}
</style>
