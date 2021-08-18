<template>
  <ElRow class="w-full mr-8 mt-4 cursor-pointer">
    <ElCol :span="8" class="flex items-center">
      <ElAvatar :src="infoData?.avatarUrl" :size="42"></ElAvatar>
    </ElCol>
    <ElCol :span="8">
      <div class="flex flex-col items-start ml-2">
        <span class="w-1/2 font-bold text-lg" style="color: #636e72">
          {{
          infoData?.nickname
          }}
        </span>
        <span class="w-1/2"></span>
      </div>
    </ElCol>
    <ElCol :span="8" class="flex items-center justify-end icons">
      <i class="iconfont icongengduo-copy"></i>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";
import { ElAvatar, ElCol, ElRow } from "element-plus";

const props = defineProps({
  infoData: {
    type: Object,
    default: () => ({}),
  },
});
</script>
<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}
</style>
