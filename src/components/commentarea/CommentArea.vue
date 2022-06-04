<template>
  <el-row class="w-full">
    <el-col :span="2" class="px-4">
      <router-link :to="{ path: '/user/home', uid: videoAndUserInfo.artistNames[0].id }">
        <el-avatar :src="videoAndUserInfo.artistNames[0].img1v1Url"></el-avatar>
      </router-link>
    </el-col>
    <el-col :span="15">
      <div class="w-full h-full" contenteditable>{{ videoAndUserInfo.artistNames[0].name }}</div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { ElRow, ElCol, ElAvatar } from "element-plus";
import { PropType } from "vue";

import type { VIDEO_INFO } from "../../layout/playervideo";

const props = defineProps({
  videoAndUserInfo: {
    type: Object as PropType<VIDEO_INFO>,
    required: true,
  },
});
</script>
<style scoped lang="scss"></style>
