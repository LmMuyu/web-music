<template>
  <div v-for="(itme, index) in renderList" :key="index" class="flex py-1">
    <div>
      <el-image
        :src="itme.sharePicUrl + '?param=36y42'"
        style="width: 38px; height: 40px"
        class="rounded-md"
      ></el-image>
    </div>
    <div class="flex flex-col px-4">
      <p>{{ itme.title ? `#${itme.title}#` : itme.nickname }}</p>
      <p style="color: #dfe6e9" class="w-56 truncate">
        {{
          itme.participateCount ? itme.participateCount + "人参与" : itme.msg
        }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElImage } from "element-plus";

import type { PropType } from "@vue/runtime-core";

defineProps({
  renderList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
</script>
<style scoped lang="scss"></style>
