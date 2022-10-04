<template>
  <div tag="conventional">
    <div class="py-4 text-sm">常规</div>
    <div class="flex items-center">
      <span class="text-xs">字体选择：</span>
      <el-select v-model="value" class="m-2" placeholder="Select" size="small">
        <!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" /> -->
      </el-select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElSelect, ElOption } from "element-plus";
import { ref } from "vue";

const value = ref("默认");

// 自动播放：首次进入播客页时自动播放（不指歌时）播放进度：效果◇开启音乐淡入淡出（仅支持输出设督 DirectSound )输出设备：指放下一首歌时生效 DirectSound ：主声音驱动程序
</script>
<style scoped lang="scss"></style>
