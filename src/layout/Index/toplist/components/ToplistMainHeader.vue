<template>
  <el-row class="w-full dashed" style="height: 57px">
    <el-col :span="12" class="flex items-center">
      <div class="flex items-end">
        <span class="text-lg">网易云{{ headerInfo?.name }}</span>
        <span class="ml-5 text-sm text-gray-500 h-full">{{ headerInfo?.trackUpdateTime }}</span>
      </div>
    </el-col>
    <el-col :span="5" class="flex items-center">
      <span class="px-3 flex items-center cursor-pointer icons">
        <i class="iconfont iconfenxiang px-1"></i>
        <p class="text-sm">{{ headerInfo?.shareCount }}</p>
      </span>
      <span class="px-3 flex items-center cursor-pointer icons">
        <i class="iconfont iconpinglun_huabanfuben px-1"></i>
        <p class="text-sm">{{ headerInfo?.commentCount }}</p>
      </span>
    </el-col>
    <el-col :span="7" class="flex justify-end relative">
      <div>
        <el-button type="primary" class="flex">
          <div class="flex items-center">
            <span class="iconplay">
              <i class="iconfont iconbofang1"></i>
            </span>
            <span>
              <h4 class="ml-2">全部播放</h4>
            </span>
          </div>
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";

import { ElRow, ElCol, ElButton } from "element-plus";


const props = defineProps({
  headerInfo: {
    type: Object,
    default: () => ({}),
  },
});
</script>
<style scoped lang="scss">
.icons {
  @include Iconfont(#b2bec3, 14);
}
.iconplay {
  @include Iconfont(#ffffff, 14);
}
.dashed {
  box-shadow: 0 1px bisque;
}
</style>
