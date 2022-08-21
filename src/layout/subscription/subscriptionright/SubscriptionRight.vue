<template>
  <el-container class="h-full">
    <el-header class="h-1/5 bg-white">
      <subscrion-user-info />
    </el-header>
    <el-main  style="overflow: hidden;" class="h-full p-4 bg-white">
      <better-scroll :isminusviewposth="true" :open-h-render="false">
        <subscrion-new-meg />
        <subscrion-topic />
      </better-scroll>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import SubscrionUserInfo from "./components/SubscrionUserInfo.vue";
import SubscrionNewMeg from "./components/SubscrionNewMeg.vue";
import SubscrionTopic from "./components/SubscrionTopic.vue";
import { ElContainer, ElHeader, ElMain } from "element-plus";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
</script>
<style scoped lang="scss"></style>
