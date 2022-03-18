<template>
  <el-row class="w-full h-full">
    <el-col :span="2" class="px-4">
      <el-avatar></el-avatar>
    </el-col>
    <el-col :span="15">
      <div class="w-full h-full" contenteditable>ddd</div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { ElRow, ElCol, ElAvatar } from "element-plus";
</script>
<style scoped lang="scss"></style>
