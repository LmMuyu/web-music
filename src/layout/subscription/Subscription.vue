<template>
  <el-container>
    <el-header height="44px" class="header"><subscription-header /></el-header>
    <el-main><subscription-content /></el-main>
  </el-container>
</template>
<script setup lang="ts">
import SubscriptionHeader from "./components/SubscriptionHeader.vue";
import SubscriptionContent from "./components/SubscriptionContent.vue";
import { ElContainer, ElMain, ElHeader } from "element-plus";
</script>
<style scoped lang="scss">
.header {
  padding: 0;
}
</style>
