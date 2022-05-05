<template>
  <div class="relative" style="background-color: #f5f5f5">
    <div class="flex items-center p-2">
      <a :href="resource.webviewUrl" target="_blank">
        <el-image :src="resource.coverImgUrl" style="width: 42px; height: 42px"></el-image>
      </a>
      <a :href="resource.webviewUrl" target="_blank" class="text-sm px-4 bottom_line">
        {{ resource.title }}
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElImage } from "element-plus";

const props = defineProps({
  resource: Object,
});
</script>
<style scoped lang="scss">
.bottom_line {
  @include Decoration_Hover;
}
</style>
