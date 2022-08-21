<template>
  <el-container class="flex h-full bg-white">
    <el-container>
      <el-header height="44px" class="header">
        <subscription-header />
      </el-header>
      <el-main style="background-color: #fff">
        <subscription-content />
      </el-main>
    </el-container>
    <el-aside width="300px" style="overflow: hidden">
      <subscription-right></subscription-right>
    </el-aside>
  </el-container>
</template>
<script setup lang="ts">
import SubscriptionHeader from "./components/SubscriptionHeader.vue";
import SubscriptionContent from "./components/SubscriptionContent.vue";
import { ElContainer, ElMain, ElHeader, ElAside } from "element-plus";
import SubscriptionRight from "./subscriptionright/SubscriptionRight.vue";
</script>
<style scoped lang="scss">
.header {
  padding: 0;
}
</style>
