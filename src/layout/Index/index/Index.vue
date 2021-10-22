<template>
  <el-container>
    <el-header height="40px">
      <IndexHeaderModule />
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ElContainer, ElHeader, ElMain } from "element-plus";
import IndexHeaderModule from "./components/IndexHeaderModule.vue";


</script>
<style scoped lang="scss">
</style>
