<template>
  <div class="flex items-center w-full h-full bg-white">
    <div class="w-1/2 text-xl font-bold"><p class="px-4">订阅动态</p></div>
    <div class="w-1/2 flex justify-end">
      <div class="w-1/2 flex">
        <div class="flex justify-center items-center rounded-full">
          <!-- <i class="iconfont iconlnicon34 mx-1"></i>
        <p class="h-full">写动态</p> -->
          <FontIcon icon="iconw_shuxie" title="写动态" size="30"></FontIcon>
        </div>
        <div class="flex items-center px-6">
          <el-avatar :src="userinfo?.data?.avatarUrl"></el-avatar>
          <span class="font-bold px-2"> {{ userinfo?.data?.nickname }} </span>
        </div>
      </div>
    </div>
  </div>
</template>
>
<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { ElAvatar } from "element-plus";

import FontIcon from "../../../components/fonticon/FontIcon.vue";

const store = useStore();

const userinfo = computed<any>(store.getters["login/getUserData"]);
</script>
<style scoped lang="scss">
.rounded_text {
  color: #fff;
  background: #74b9ff;
}
</style>
