<template>
  <ElDrawer
    @closed="unmountedLoadingCom"
    :showClose="false"
    :withHeader="false"
    :modelValue="true"
    ref="drawerNode"
  >
    <div class="h-full relative" ref="drawerMainContent">
      <header class="p-4" ref="headerNode">
        <p class="text-lg">历史记录</p>
      </header>
      <main v-if="countRef">
        <VirtualList
          :renderData="renderData"
          :height="32"
          keyindex="key"
          :scrollHeight="unref(drawerMainHeight)"
        >
          <template v-slot="{ scopeData }">
            <ChildrenItem :scopedData="musicResultDetail(scopeData.song)" />
          </template>
        </VirtualList>
      </main>
    </div>
  </ElDrawer>
</template>
<script setup lang="ts">
import {
  defineProps,
  nextTick,
  onMounted,
  ref,
  unref,
  watch,
} from "@vue/runtime-core";

import { musicResultDetail } from "../../../../utils/musicDetail";
import { createLoading } from "../../../../components/loading/app";
import { setRenderDataID } from "./hooks/methods";

import VirtualList from "/comps/virtuallist/VirtualList.vue";
import ChildrenItem from "./components/ChildrenItem.vue";
import { ElDrawer } from "element-plus";

import type { PropType } from "vue";

const props = defineProps({
  record: {
    type: Object as PropType<Readonly<Record<string, any>>>,
    default: () => ({
      allData: [],
    }),
  },
});

const { countRef, negate, mountApp, unmountApp, isMountApp } =
  new createLoading();

const drawerMainHeight = ref(0);
const headerNode = ref<HTMLElement | null>(null);
const drawerNode = ref<Record<string, any> | null>(null);
const drawerMainContent = ref<HTMLElement | null>(null);

const renderData = ref<any[]>([]);

watch(
  () => [renderData.value, drawerMainContent],
  (value) =>{
    nextTick(unmountedLoadingCom)
  }
);

renderData.value = setRenderDataID(props.record.allData);

function unmountedLoadingCom() {
  console.log(isMountApp());

  isMountApp() && unmountApp(negate);
}

onMounted(() => {
  nextTick(() => {
    if (drawerMainContent.value) {
      mountApp(drawerMainContent.value);
    }

    if (drawerNode.value && headerNode.value) {
      drawerMainHeight.value =
        drawerNode.value.$refs.drawerRef.clientHeight -
        headerNode.value.offsetHeight;
    }
  });
});
</script>
