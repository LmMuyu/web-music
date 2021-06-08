<template>
  <div class="flex h-full">
    <el-container class="w-2/3">
      <el-header class="h-1/6 flex items-center">
        <nav class="w-full h-full">
          <mainNavTag @loadComps="runload" />
        </nav>
      </el-header>
      <el-main class="h-5/6">
        <keep-alive>
          <component :is="componentId"></component>
        </keep-alive>
      </el-main>
    </el-container>

    <el-container class="w-1/3">
      <el-header class="h-1/6"></el-header>
      <el-main class="h-5/6 track_bar">
        <component :is="compsId"></component>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { componentId, putView, compsId, switchView } from "./hooks/component";

import { ElContainer, ElHeader, ElMain } from "element-plus";
import mainNavTag from "./components/mainNavTag.vue";

function runload(compsStrList) {
  putView(compsStrList);
  switchView(compsStrList);
}
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
