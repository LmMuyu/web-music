<template>
  <div class="flex h-full">
    <el-container v-if="shieldContainer(left?.main)" class="w-2/3">
      <el-header
        v-if="shieldContainer(left?.header)"
        class="h-1/6 flex items-center"
      >
        <slot></slot>
      </el-header>
      <el-main
        v-if="shieldContainer(left?.center)"
        :class="[!shieldContainer(left?.header) ? 'h-full' : 'h-5/6']"
        class="track_bar"
      >
        <component :is="componentId"></component>
      </el-main>
    </el-container>
    <el-container
      class="w-1/3 border-l border-solid"
      style="border-color: '#636e7266'"
      v-if="shieldContainer(right?.main)"
    >
      <el-header
        v-if="shieldContainer(right?.header)"
        class="h-1/6 flex justify-center items-center"
      >
        <Search
          class="w-4/5 h-2/3 border border-gray-500 border-solid rounded-2xl"
          input-class="w-full"
          :returnresdata="returnresdata"
        />
      </el-header>
      <el-main
        v-if="shieldContainer(right?.center)"
        :class="[!shieldContainer(right?.header) ? 'w-full' : 'h-5/6']"
        class="text track_bar"
      >
        <component :is="compsId"></component>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { computed, onActivated } from "@vue/runtime-core";
import { useRoute } from "vue-router";

import { componentId, compsId, runLoadView } from "./hooks/component";

import { ElContainer, ElHeader, ElMain } from "element-plus";
import Search from "../search/Search.vue";

import type { META } from "../../routes/type/type";

const router = useRoute();
const meta: META = router.meta;

const defaultView = meta.defaultView;
const { left, right } = meta?.mainContentOptions || { left: {}, right: {} };

onActivated(() => {
  runLoadView(defaultView);
});

const returnresdata = (any: any) => {
  console.log(any);
};

const shieldContainer = computed(() => {
  return function (state: boolean) {
    return state + "" === "false" ? state : true;
  };
});
</script>
<style scoped lang="scss">
.track_bar::-webkit-scrollbar {
  display: none;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: ""; /*不用有内容也可以*/
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}
</style>
