<template>
  <el-container class="h-full">
    <el-header class="flex items-center solide_border">
      <el-avatar size="medium" :src="viewMsg[0].avatarUrl"></el-avatar>
      <span class="ml-4">{{ viewMsg[0].nickname }}</span>
    </el-header>
    <el-container>
      <el-container>
        <el-main class="overflow-x-hidden"> <MessageChatBoxItem /></el-main>
        <el-footer class="solide_border_top">Footer</el-footer>
      </el-container>
      <el-aside class="solide_border_left" style="width: 20%">Aside</el-aside>
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
import MessageChatBoxItem from "./MessageChatBoxItem.vue";

import type { PropType } from "vue";

const props = defineProps({
  viewMsg: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
</script>
<style scoped lang="scss">
.solide_border {
  border-bottom: 1px solid #f5f6fa;
}

.solide_border_left {
  border-left: 1px solid #f5f6fa;
}

.solide_border_top {
  border-top: 1px solid #f5f6fa;
}
</style>
