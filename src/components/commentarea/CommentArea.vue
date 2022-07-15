<template>
  <div class="flex" :class="class">
    <router-link :to="{ path: '/user/home', uid: videoAndUserInfo.artistNames[0].id }">
      <el-avatar :src="videoAndUserInfo.artistNames[0].img1v1Url"></el-avatar>
    </router-link>
    <div class="w-full h-full ml-4" contenteditable>{{ videoAndUserInfo.artistNames[0].name }}</div>
  </div>
</template>
<script setup lang="ts">
import { ElAvatar } from "element-plus";
import { PropType } from "vue";

import type { VIDEO_INFO } from "../../layout/playervideo";

const props = defineProps({
  videoAndUserInfo: {
    type: Object as PropType<VIDEO_INFO>,
    required: true,
  },
  class: String,
});
</script>
<style scoped lang="scss"></style>
