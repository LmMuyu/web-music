<template>
  <div class="flex items-center cursor-pointer">
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
</template>
<script setup lang='ts'>
import { defineProps, } from "vue"
import type { PropType } from "vue";

import { ElImage } from "element-plus";

import type { UserInfo } from "../../../store/type";

const props = defineProps({
  userInfo: {
    type: Object as PropType<UserInfo>,
    default: () => { }
  }
})


console.log(props.userInfo);


</script>
<style scoped lang='scss'></style> 