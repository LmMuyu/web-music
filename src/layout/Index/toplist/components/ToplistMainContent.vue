<template>
  <div class="py-6">
    <el-checkbox v-model="isselect">全选</el-checkbox>
  </div>
  <div>
    <ul class="list-none">
      <li
        v-for="(tracksItem, index) in renderListData"
        :key="tracksItem.id"
        class="flex items-center p-3 cursor-pointer borderslode"
        ref="features"
      >
        <div class="flex items-center w-full">
          <el-checkbox v-model="tracksItem.select"></el-checkbox>
          <h4
            :class="[
              index + 1 <= 3
                ? 'text-red-600 text-2xl'
                : 'text-gray-300 text-xl',
            ]"
            class="text px-2"
          >{{ index + 1 }}</h4>
          <router-link :to="{ path: '/playlist', query: { id: tracksItem.id } }">
            <div class="w-full flex py-4 items-center">
              <span class="ml-3 flex">
                {{ tracksItem?.ar[0]?.name }} - {{ tracksItem?.al?.name }}
                <p v-html="aliasName(tracksItem?.alia)" class></p>
              </span>
            </div>
          </router-link>
        </div>
        <div>
          <ToplistMainFeaturesModule />
        </div>
      </li>
    </ul>
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

import ToplistMainFeaturesModule from "./ToplistMainFeaturesModule.vue";
import { ElCheckbox } from "element-plus";

import type { PropType } from "@vue/runtime-core";

const props = defineProps({
  listData: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
});

const features = ref(null);
const hoverList: any[] = [];

const isselect = ref(true);
watch(isselect, (value) => {
  console.log(value);
});

const renderListData = computed<Record<string, any>>(() => {
  return props.listData.map((listItem) =>
    markRaw({
      ...listItem,
      select: true,
    })
  );
});

const aliasName = computed(() => {
  return function(item: []) {
    return item.reduce(
      (pre, cur) => (pre += `<h4 class="text-gray-300">&nbsp -(${cur})</h4>`),
      ""
    );
  };
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
