<template>
  <el-container>
    <el-header class="h-1/6">
      <nav>
        <mainNavTag />
      </nav>
    </el-header>
    <el-main class="h-5/6"></el-main>
  </el-container>
</template>
<script setup lang="ts">
import mainNavTag from "./components/mainNavTag.vue";
import { ElContainer, ElHeader, ElMain } from "element-plus";
</script>
<style scoped lang="scss"></style>
