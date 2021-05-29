<template>
  <div class="flex flex-col">
    <div
      class="flex items-center cursor-pointer"
      @mouseenter="mouseEnter(isEnter)"
      @mouseleave="mouseLeave(isEnter)"
    >
      <el-image
        style="border-radius: 50%"
        class="w-11 h-11"
        :src="userInfo?.userInfoData?.avatarUrl"
      >
      </el-image>
      <span class="ml-3 text-lg text-gray-100">{{
        userInfo?.userInfoData?.nickname
      }}</span>
    </div>
    <div class="relative">
      <ShowUserInfomodule @mouseleave="mouseLeave(isEnter)" v-if="isEnter" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineAsyncComponent, ref } from "vue";
import type { PropType } from "vue";

import { ElImage } from "element-plus";
const ShowUserInfomodule = defineAsyncComponent(
  () => import("./components/ShowUserInfomodule.vue")
);

import { mouseEnter, mouseLeave } from "./hooks/methods";

import type { UserInfo } from "../../../store/type";

const props = defineProps({
  userInfo: {
    type: Object as PropType<UserInfo>,
    default: () => {},
  },
});

const isEnter = ref(false);
</script>
<style scoped lang="scss"></style>
