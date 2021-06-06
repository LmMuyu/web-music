<template>
  <div>
    <el-container class="w-2/3">
      <el-header class="h-1/6 flex items-center">
        <nav class="w-full">
          <mainNavTag />
        </nav>
      </el-header>
      <el-main class="h-5/6">
        <component :is="componentId"></component>
      </el-main>
    </el-container>
    <div class="w-1/3"></div>
  </div>
</template>
<script setup lang="ts">
import { componentId } from "./hooks/component";

import mainNavTag from "./components/mainNavTag.vue";
import { ElContainer, ElHeader, ElMain } from "element-plus";
</script>
<style scoped lang="scss"></style>
