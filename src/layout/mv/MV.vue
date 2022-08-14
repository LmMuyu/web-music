<template>
  <el-container class="bg-white h-full">
    <el-main class="bar">
      <MvLatest />
      <MvHot />
      <MvExclusive />
      <MvTop />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import MvExclusive from "./components/MvExclusive.vue";
import { ElContainer, ElMain } from "element-plus";
import MvLatest from "./components/MvLatest.vue";
import MvHot from "./components/MvHot.vue";
import MvTop from "./components/MvTop.vue";
</script>
<style scoped lang="scss">
.bar {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
