<template>
  <div class="flex w-full py-2">
    <div>
      <ElImage
        :lazy="true"
        style="width: 60px; height: 60px; border-radius: 6px"
        :src="songitem.coverImgUrl"
      />
    </div>
    <ElRow class="flex-1 flex items-center">
      <ElCol :span="14" class="pl-4">
        <p>
          {{ songitem.name }}
        </p>
      </ElCol>
      <ElCol :span="5" class="flex items-center">
        <p>歌曲：{{ songitem.trackCount }}首</p>
      </ElCol>
      <ElCol :span="5">
        <p>by：大为降低</p>
      </ElCol>
    </ElRow>
    <div class="flex items-center">
      <span>
        <p>{{ 0 }}</p>
      </span>
      <span>
        <p>{{ 1255 }}</p>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElRow, ElCol, ElImage } from "element-plus";

const props = defineProps({
  songitem: {
    type: Object,
    required: true,
  },
});
</script>
<style scoped lang="scss"></style>
