<template>
  <component
    ref="model"
    :moduleInfoCard="moduleInfoCard"
    :infoData="infoData"
    :is="modelComp"
    @logout="updateModelStatus"
  />
  <ElRow
    ref="infocard"
    class="flex items-center justify-center w-full cursor-pointer transform-gpu translate-y-6"
  >
    <MainInfoCard :infoData="infoData" />
    <ElCol :span="4" class="flex items-center justify-end icons">
      <i class="iconfont icongengduo-copy" openModel="copy" @click="openLoginModel"></i>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { defineAsyncComponent, defineProps, reactive, shallowRef } from "@vue/runtime-core";
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
const infocard = shallowRef(null);

const moduleInfoCard = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

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
  infoCardModulePosInfo();
  updateModelStatus();
}

function modelCompEvent(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const bute = target.getAttribute("openModel");

  if (!!bute) return;

  const x = e.clientX + 16;
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

function infoCardModulePosInfo() {
  //@ts-ignore
  const el = infocard.value.$el as HTMLElement;
  const posinfo = el.getBoundingClientRect();
  moduleInfoCard.x = posinfo.x;
  moduleInfoCard.y = posinfo.y;
  moduleInfoCard.width = posinfo.width;
  moduleInfoCard.height = posinfo.height;
}
</script>

<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}
</style>
