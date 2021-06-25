<template>
  <div class="flex h-full">
    <el-container class="w-2/3">
      <el-header class="h-1/6 flex items-center">
        <slot></slot>
      </el-header>
      <el-main class="h-5/6 track_bar">
        <keep-alive>
          <component :is="componentId"></component>
        </keep-alive>
      </el-main>
    </el-container>
    <el-container
      class="w-1/3 border-l border-solid"
      style="border-color: '#636e7266'"
    >
      <el-header class="h-1/6">
        <Search
          class="w-full h-3/4"
          input-class="w-full"
          :returnresdata="returnresdata"
        />
      </el-header>
      <el-main class="h-5/6 track_bar">
        <component :is="compsId"></component>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";

import { componentId, compsId, runLoadView } from "./hooks/component";

import { ElContainer, ElHeader, ElMain } from "element-plus";
import Search from "../search/Search.vue";

const defaultView = useRoute().meta.defaultView as string[];

runLoadView(defaultView);

const returnresdata = (any) => {
  console.log(any);
};
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
