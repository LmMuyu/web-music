<template>
  <main ref="rootcontent" class="h-full">
    <div class="py-6" v-if="isCheckbox && countRef">
      <el-checkbox v-model="isselect">全选</el-checkbox>
    </div>
    <div class="overflow-y-auto h-full" v-if="countRef">
      <VirtualList
        v-if="openVirtuallist"
        :renderData="renderListData"
        keyindex="indexOnly"
        :height="61"
      >
        <template v-slot="{ scopeData: { renderItem, index, keyindex } }">
          <ToplistMainItem
            :index="index"
            :isRank="isRank"
            :keyindex="keyindex"
            :renderItem="renderItem"
            @mouseleave="leaveActive(index)"
            @mouseenter="moveActive(index)"
            :style="activeStyle(index)"
            @change="onChange"
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
  </main>
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  nextTick,
  ref,
  watch,
  onUnmounted,
} from "@vue/runtime-core";

import { createLoading } from "../../../../components/loading/app";
import { activeIndex } from "../../../../utils/activeIndex";
import { getMittBus } from "../../../../utils/mittBus";

import VirtualList from "../../../../components/virtuallist/VirtualList.vue";
import ToplistMainItem from "./ToplistMainItem.vue";
import { ElCheckbox } from "element-plus";

import type { PropType } from "@vue/runtime-core";

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

const { countRef, negate, mountApp, unmountApp, isMountApp } =
  new createLoading();
const mittBus = getMittBus();

const features = ref(null);
const hoverList: any[] = [];
const rootcontent = ref<HTMLElement | null>(null);

let select: "children" | "" = "";
const isselect = ref(true);

watch(isselect, (value) => {
  if (select === "children") {
    console.log(select);

    select = "";
    return;
  }

  renderListData.value.map((s) => (s.select.value = value));
});

const putSelect = (value: boolean) => {
  select = "children";
  if (value === false) {
    isselect.value = value;
    return;
  }

  const res = renderListData.value.every((v) => v.select.value);

  if (res) {
    isselect.value = true;
  }
};

const renderListData = computed(() => {
  return props.listData.map((listItem, index) => ({
    index,
    ...listItem,
    select: ref(true),
    indexOnly: index,
  }));
});

watch(
  () => renderListData.value,
  () => {
    isMountApp() && unmountApp(negate);
  }
);

const { leaveActive, moveActive, activeStyle } = new activeIndex(null, null, {
  initColor: "#fff",
  style: "background",
  enterColor: "#c0dbf7",
  initSetStyle: false,
});

const busMap = mittBus.all;

if (!busMap.has("markvrituallist")) {
  mittBus.on("markvrituallist", () => {
    countRef.value = false;

    if (!isMountApp() && rootcontent.value) {
      mountApp(rootcontent.value);
    }
  });
}

const onChange = () => putSelect(isselect.value);

onMounted(() => {
  nextTick().then(() => {
    hoverList.push({
      el: features.value,
      styles: {
        nackgroundColor: "#0984e3",
      },
    });

    if (rootcontent.value) {
      mountApp(rootcontent.value);
    }
  });
});

onUnmounted(() => {
  isMountApp() && unmountApp(negate);
});
</script>
<style scoped lang="scss">
.borderslode {
  border-bottom: 1px solid #ecf0f1;
}
</style>
