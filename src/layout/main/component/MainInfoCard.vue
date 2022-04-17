<template>
  <ElCol :span="6" class="flex items-center pl-4">
    <ElAvatar :src="infoData?.avatarUrl" :size="48"></ElAvatar>
  </ElCol>
  <ElCol :span="8">
    <div class="flex flex-col items-start ml-2">
      <span class="font-bold text-lg" style="color: #0F1419">
        {{ infoData?.nickname }}
      </span>
      <span></span>
    </div>
  </ElCol>
</template>
<script setup lang="ts">
import { ElAvatar, ElCol } from "element-plus";

const props = defineProps({
  infoData: {
    type: Object,
    default: () => ({}),
  },
});
</script>
<style scoped lang="scss"></style>
