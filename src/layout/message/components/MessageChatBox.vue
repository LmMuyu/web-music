<template>
  <el-container class="h-full">
    <el-header class="flex items-center solide_border">
      <el-avatar></el-avatar>
      <span></span>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { defineProps } from "vue";

import {
  ElContainer,
  ElFooter,
  ElAside,
  ElHeader,
  ElMain,
  ElAvatar,
} from "element-plus";

const props = defineProps({
  viewMsg: {
    type: Object,
    default: () => ({}),
  },
});
</script>
<style scoped lang="scss">
.solide_border {
  border-right: 1px solid #f5f6fa;
}
</style>
