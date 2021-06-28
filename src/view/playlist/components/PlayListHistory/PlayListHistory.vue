<template>
  <ElDrawer
    @closed="unmountApp"
    @opened="drawerOpenClose"
    :showClose="false"
    :withHeader="false"
    :modelValue="true"
    ref="drawerNode"
  >
    <div class="h-full relative" ref="drawerMainContent">
      <header class="p-4" ref="headerNode">
        <p class="text-lg">历史记录</p>
      </header>
      <main>
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
} from "@vue/runtime-core";

import { musicResultDetail } from "../../../../utils/musicDetail";
import { setRenderDataID } from "./hooks/methods";
import { unmountApp } from "./index";

import VirtualList from "/comps/virtuallist/VirtualList.vue";
import ChildrenItem from "./components/ChildrenItem.vue";
import { ElDrawer } from "element-plus";

import type { PropType } from "vue";
import { mountApp } from "../../../../components/loading/app";

type unmounAppFn = (backcall?: Function | undefined) => void;

const props = defineProps({
  record: {
    type: Object as PropType<Readonly<Record<string, any>>>,
    default: () => ({
      allData: [],
    }),
  },
});

const drawerNode = ref<Record<string, any> | null>(null);
const headerNode = ref<HTMLElement | null>(null);
const drawerMainContent = ref<HTMLElement | null>(null);
const drawerMainHeight = ref(0);

const renderData = ref<any[]>([]);
renderData.value = setRenderDataID(props.record.allData);

let unmounApp: unmounAppFn | null = null;
const drawerOpenClose = () => {};

onMounted(() => {
  nextTick(() => {
    if (drawerMainContent.value) {
      // unmounApp = mountApp(drawerMainContent.value);
    }

    if (drawerNode.value && headerNode.value) {
      drawerMainHeight.value =
        drawerNode.value.$refs.drawerRef.clientHeight -
        headerNode.value.offsetHeight;
    }
  });
});
</script>
