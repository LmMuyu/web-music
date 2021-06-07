<template>
  <div class="flex h-full">
    <el-container class="w-2/3">
      <el-header class="h-1/6 flex items-center">
        <nav class="w-full h-full">
          <mainNavTag />
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
      <el-main class="h-5/6">
        <TopListAsideTag />
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { componentId } from "./hooks/component";

import TopListAsideTag from "/layout/Index/toplist/components/TopListAsideTag.vue";
import { ElContainer, ElHeader, ElMain } from "element-plus";
import mainNavTag from "./components/mainNavTag.vue";
</script>
<style scoped lang="scss"></style>
