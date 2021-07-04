<template>
  <ElDrawer
    @closed="unmountedLoadingCom"
    :showClose="false"
    :withHeader="false"
    :modelValue="true"
    size="25%"
    ref="drawerNode"
  >
    <div class="relative" ref="drawerMainContent">
      <header class="p-4" ref="headerNode">
        <p class="text-lg">历史记录</p>
      </header>
      <main class="px-4 mb-4 mainHeight" v-if="countRef">
        <VirtualList
          :renderData="renderData"
          :height="39"
          keyindex="key"
          :scrollHeight="unref(drawerMainHeight)"
        >
          <template v-slot="{ scopeData: { renderItem, index, keyindex } }">
            <ChildrenItem :scopedData="musicResultDetail(renderItem.song)" />
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
  onUnmounted,
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
  (value) => {
    nextTick(unmountedLoadingCom);
  }
);

// const resize = new ResizeObserver((entries) => {
//   console.log(entries);
// });

function unmountedLoadingCom() {
  isMountApp() && unmountApp(negate);
}

onMounted(() => {
  nextTick(() => {
    if (drawerMainContent.value) {
      mountApp(drawerMainContent.value);
      // resize.observe(drawerMainContent.value);
    }

    renderData.value = setRenderDataID(props.record.allData);

    if (drawerNode.value && headerNode.value) {
      drawerMainHeight.value =
        drawerNode.value.$refs.drawerRef.clientHeight -
        headerNode.value.offsetHeight;
    }
  });
});

onUnmounted(() => {
  if (drawerMainContent.value) {
    // resize.unobserve(drawerMainContent.value);
  }
});
</script>

<style scoped lang="scss">
.mainHeight {
  height: calc(100vh - 45px);
}
</style>
