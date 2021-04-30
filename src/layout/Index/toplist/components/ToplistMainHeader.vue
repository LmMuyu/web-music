<template>
  <el-row class="w-full pb-5 dashed" style="height: 57px">
    <el-col :span="10" class="flex items-center pb-5">
      <div class="flex items-end">
        <span class="text-3xl">网易云{{ listData?.[0]?.name }}</span>
        <span class="ml-5 text-xl text-gray-500 h-full">{{ dateFormat }}</span>
      </div>
    </el-col>
    <el-col :span="11" class="flex items-center pb-5">
      <div class="flex">
        <span class="px-3 flex items-center cursor-pointer icons">
          <i class="iconfont iconfenxiang px-1"></i>
          <p class="text-sm">{{ listData[0]?.shareCount }}</p>
        </span>
        <span class="px-3 flex items-center cursor-pointer icons">
          <i class="iconfont iconpinglun_huabanfuben px-1"></i>
          <p class="text-sm">{{ listData[0]?.commentCount }}</p>
        </span>
      </div>
    </el-col>
    <el-col :span="3" class="pb-5 relative">
      <el-button type="primary" class="flex">
        <div class="flex items-center">
          <span class="iconplay">
            <i class="iconfont iconbofang1"></i>
          </span>
          <h4 class="ml-2">全部播放</h4>
        </div>
      </el-button>
    </el-col>
  </el-row>
</template>
 <script setup lang='ts'>
import { computed, defineProps } from "@vue/runtime-core";
import { ElRow, ElCol, ElButton } from "element-plus";
import type { ListItem } from "../types/requestType";
import type { PropType } from "@vue/runtime-core";

const props = defineProps({
  listData: {
    type: Array as PropType<ListItem[]>,
    default: () => [],
  },
});

const dateFormat = computed(() => {
  const listKey = props.listData?.[0]?.trackUpdateTime;
  return `${listKey?.$y}-${listKey?.$W}-${listKey?.$D}  更新`;
});
</script>
<style scoped lang='scss'>
.icons {
  @include Iconfont(#b2bec3, 14);
}
.iconplay {
  @include Iconfont(#636e72, 14);
}
.dashed {
  border-bottom: 1px dashed #b2bec3;
}
</style>