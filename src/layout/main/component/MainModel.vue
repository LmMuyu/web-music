<template>
  <transition name="model">
    <section class="w-full p-4 rounded-md absolute -top-full left-0 right-0">
      <el-row class="py-2">
        <MainInfoCard :infoData="infoData" />
      </el-row>
      <div class="whitespace-nowrap py-4" style="background-color: #74b9ff">
        <p class="text-center">退出登录</p>
      </div>
    </section>
  </transition>
</template>
<script setup lang="ts">
import { useAttrs } from "@vue/runtime-core";

import MainInfoCard from "./MainInfoCard.vue";
import { ElRow } from "element-plus";

const attrs = useAttrs();

const infoData = attrs["infoData"];
</script>
<style scoped lang="scss">
.model-enter-active {
  transition: all 0.5s;
}

.model-leave-active {
  transition: all 0.5s;
}

.model-enter-from,
.model-levae-to {
  opacity: 0;
}

.model-center-to,
.model-levae-from {
  opacity: 1;
}
</style>
