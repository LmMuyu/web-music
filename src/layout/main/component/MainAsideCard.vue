<template>
  <component
    ref="model"
    :infoData="infoData"
    :is="modelComp"
    @logout="updateModelStatus"
  />
  <ElRow class="w-full mr-8 mt-4 cursor-pointer">
    <MainInfoCard :infoData="infoData" />
    <ElCol :span="8" class="flex items-center justify-end icons">
      <i
        class="iconfont icongengduo-copy"
        openModel="copy"
        @click="openLoginModel"
      ></i>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import {
  defineAsyncComponent,
  defineProps,
  onMounted,
  shallowRef,
} from "@vue/runtime-core";
import { ref } from "vue";
import { useStore } from "vuex";

import { ElCol, ElRow } from "element-plus";
import MainInfoCard from "./MainInfoCard.vue";
const MainModel = defineAsyncComponent(() => import("./MainModel.vue"));

const props = defineProps({
  infoData: {
    type: Object,
    default: () => ({}),
  },
});

const store = useStore();

const modelComp = shallowRef();
const model = ref<HTMLElement | null>(null);

function updateModelStatus() {
  if (modelComp.value) {
    modelComp.value = null;
    window.removeEventListener("mousedown", modelCompEvent, false); //卸载事件
  } else {
    modelComp.value = MainModel;
    window.addEventListener("mousedown", modelCompEvent, false);
  }
}

function openLoginModel() {
  updateModelStatus();
}

function modelCompEvent(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const bute = target.getAttribute("openModel");

  if (!!bute) return;

  const x = e.clientX;
  const y = e.clientY;

  const logoutModelInfo = store.getters["maintags/getPosInfo"];

  if (
    !(
      logoutModelInfo.mx <= x &&
      x <= logoutModelInfo.maxX &&
      logoutModelInfo.my <= y &&
      y <= logoutModelInfo.maxY
    )
  ) {
    updateModelStatus();
    return;
  }
}

onMounted(() => {});
</script>

<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}
</style>
