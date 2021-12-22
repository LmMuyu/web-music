<template>
  <el-container>
    <el-header class="flex items-center">
      <div class="w-4/5">
        <el-button> 播放全部 </el-button>
      </div>
      <div class="w-1/5 flex justify-end items-center">
        <CloudDiskSearch />
      </div>
    </el-header>
    <el-main>
      <div>
        <CloudDiskItem />
      </div>
      <div class="pt-4">
        <cloud-disk-item
          v-for="(item, index) in cloudDiskData"
          :key="index"
          :upload-item="uploadCloudDisk(item)"
        ></cloud-disk-item>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ElButton, ElContainer, ElMain, ElHeader } from "element-plus";
import CloudDiskSearch from "../../../../components/search/Search.vue";
import CloudDiskItem from "./CloudDiskItem.vue";
import { uploadCloudDisk } from "../../hooks";

import type { TITLEOPTIONS } from "../../type";
import type { PropType } from "vue";

const props = defineProps({
  cloudDiskData: {
    type: Array as PropType<TITLEOPTIONS[]>,
    default: () => [],
  },
});
</script>
<style scoped lang="scss"></style>
