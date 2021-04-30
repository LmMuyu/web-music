<template>
  <div class="py-6">
    <el-checkbox v-model="isselect">全选</el-checkbox>
  </div>
  <div>
    <ul class="list-none">
      <li
        v-for="(tracksItem, index) in listData"
        :key="tracksItem.id"
        class="flex items-center p-3 py-6 borderslode"
      >
        <el-checkbox v-model="isselect"></el-checkbox>
        <h4
          :class="[
            index + 1 <= 3 ? 'text-red-600 text-2xl' : 'text-gray-300 text-xl',
          ]"
          class="text px-2"
        >
          {{ index + 1 }}
        </h4>
        <div>
          <span class="ml-3">
            {{ tracksItem?.ar[0]?.name }} - {{ tracksItem?.al?.name }}
          </span>
        </div>
        <div></div>
      </li>
    </ul>
  </div>
</template>
<script setup lang='ts'>
import { defineProps, ref, watch } from "@vue/runtime-core";
import { onSelectAll } from "./hooks/methods";

import { ElCheckbox } from "element-plus";

import type { ListItem } from "../types/requestType";
import type { PropType } from "@vue/runtime-core";

const props = defineProps({
  listData: {
    type: Array as PropType<ListItem[]>,
    default: () => [],
  },
});

const isselect = ref(true);
watch(isselect, (value) => {
  console.log(value);
});
</script>
<style scoped lang='scss'>
.borderslode {
  border-bottom: 1px solid #ecf0f1;
}
</style>