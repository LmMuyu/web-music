<template>
  <keep-alive>
    <ElDrawer
      @closed="unmountApp"
      :showClose="false"
      :withHeader="false"
      :modelValue="true"
      ref="drawerNode"
    >
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
          <template v-slot:content="{ scopeData }">
            <ChildrenItem :scopedData="musicResultDetail(scopeData.song)" />
          </template>
        </VirtualList>
      </main>
    </ElDrawer>
  </keep-alive>
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

const props = defineProps({
  record: {
    type: Object as PropType<Readonly<Record<string, any>>>,
    default: () => ({
      allData: [],
    }),
  },
});

// const playHistory = historyList();

const drawerNode = ref<Record<string, any> | null>(null);
const headerNode = ref<HTMLElement | null>(null);

const drawerMainHeight = ref(0);

const renderData = ref<any[]>([]);

renderData.value = setRenderDataID(props.record.allData);

onMounted(() => {
  // debugger;

  nextTick(() => {
    if (drawerNode.value && headerNode.value) {
      drawerMainHeight.value =
        drawerNode.value.$refs.drawerRef.clientHeight -
        headerNode.value.offsetHeight;
    }
  });
});
</script>
