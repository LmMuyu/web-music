<template>
  <div class="py-6" v-if="isCheckbox">
    <el-checkbox v-model="isselect">全选</el-checkbox>
  </div>
  <div class="overflow-y-auto h-full" id="rootcontent">
    <VirtualList
      v-if="openVirtuallist"
      :renderData="renderListData"
      keyindex="indexOnly"
      :height="61"
      @load=""
    >
      <!-- && !closeLoading ? loading : true -->
      <template v-slot="{ scopeData: { renderItem, index, keyindex } }">
        <ToplistMainItem
          :index="index"
          :isRank="isRank"
          :keyindex="keyindex"
          :renderItem="renderItem"
        />
      </template>
    </VirtualList>
    <div
      v-else
      v-for="(renderItem, index) in renderListData"
      :key="renderItem.index"
    >
      <ToplistMainItem
        :renderItem="renderItem"
        :index="renderItem.index"
        :isRank="isRank"
        :isCheckbox="false"
        @mouseleave="leaveActive(index)"
        @mouseenter="moveActive(index)"
        :style="{ ...activeStyle(index), padding: '0px' }"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  nextTick,
  ref,
  watch,
  markRaw,
} from "@vue/runtime-core";
import { loading } from "./hooks/data";
import { unmountApp } from "../../../../components/loading/app";

import VirtualList from "/comps/virtuallist/VirtualList.vue";
import ToplistMainItem from "./ToplistMainItem.vue";
import { ElCheckbox } from "element-plus";

import type { PropType } from "@vue/runtime-core";
import { activeIndex } from "../../../../utils/activeIndex";

const props = defineProps({
  listData: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  selectAll: {
    type: Boolean,
    default: true,
  },
  closeLoading: {
    type: Boolean,
    default: false,
  },
  isRank: {
    type: Boolean,
    default: true,
  },
  openVirtuallist: {
    type: Boolean,
    default: true,
  },
  isCheckbox: {
    type: Boolean,
    default: true,
  },
});

const features = ref(null);
const hoverList: any[] = [];

const isselect = ref(true);
watch(isselect, (value) => {
  console.log(value);
});

const renderListData = computed(() => {
  return props.listData.map((listItem, index) =>
    markRaw({
      index,
      ...listItem,
      select: true,
      indexOnly: index,
    })
  );
});

watch(
  () => renderListData.value,
  () =>
    unmountApp(() => {
      loading.value = !loading.value;
    })
);

const { leaveActive, moveActive, activeStyle } = new activeIndex(null, null, {
  initColor: "#fff",
  style: "background",
  enterColor: "#c0dbf7",
  initSetStyle: false,
});

onMounted(() => {
  nextTick(() => {
    hoverList.push({
      el: features.value,
      styles: {
        nackgroundColor: "#0984e3",
      },
    });
  });
});
</script>
<style scoped lang="scss">
.borderslode {
  border-bottom: 1px solid #ecf0f1;
}
</style>
