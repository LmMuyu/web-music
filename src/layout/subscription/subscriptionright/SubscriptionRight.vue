<template>
  <el-container>
    <el-header class="h-1/5">
      <subscrion-user-info />
    </el-header>
    <el-main ain class="h-full p-4">
      <subscrion-new-meg />
      <subscrion-topic />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import SubscrionUserInfo from "./components/SubscrionUserInfo.vue";
import SubscrionNewMeg from "./components/SubscrionNewMeg.vue";
import SubscrionTopic from "./components/SubscrionTopic.vue";

import { ElContainer, ElHeader, ElMain } from "element-plus";
</script>
<style scoped lang="scss"></style>
