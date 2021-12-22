<template>
  <section>
    <el-row class="row">
      <el-col class="col" :span="9">
        <div class="w-2/5"></div>
        <div class="w-3/5">
          <p
            :class="!isNullObj && 'text-sm py-1'"
            :style="isNullObj && { color: '#606266', fontWeight: 'bold' }"
            style="text-align: center"
          >
            {{ itemInfo.musicName }}
          </p>
        </div>
      </el-col>
      <el-col class="col" :span="3">
        <p
          :class="!isNullObj && 'text-sm py-1'"
          :style="isNullObj && { color: '#606266', fontWeight: 'bold' }"
          style="text-align: center"
        >
          {{ itemInfo.singer }}
        </p>
      </el-col>
      <el-col class="col" :span="3">
        <p
          :class="!isNullObj && 'text-sm py-1'"
          :style="isNullObj && { color: '#606266', fontWeight: 'bold' }"
          style="text-align: center"
        >
          {{ itemInfo.album }}
        </p>
      </el-col>
      <el-col class="col" :span="3">
        <p
          :class="!isNullObj && 'text-sm py-1'"
          :style="isNullObj && { color: '#606266', fontWeight: 'bold' }"
          style="text-align: center"
        >
          {{ itemInfo.format }}
        </p>
      </el-col>
      <el-col class="col" :span="3">
        <p
          :class="!isNullObj && 'text-sm py-1'"
          :style="isNullObj && { color: '#606266', fontWeight: 'bold' }"
          style="text-align: center"
        >
          {{ itemInfo.size }}
        </p>
      </el-col>
      <el-col class="col" :span="3">
        <p
          :class="!isNullObj && 'text-sm py-1'"
          :style="isNullObj && { color: '#606266', fontWeight: 'bold' }"
          style="text-align: center"
        >
          {{ itemInfo.uploadTime }}
        </p>
      </el-col>
    </el-row>
  </section>
</template>
<script setup lang="ts">
import { ElRow, ElCol } from "element-plus";
import { computed, nextTick, onMounted, PropType, ref } from "vue";

import type { TITLEOPTIONS } from "../../type";

const props = defineProps({
  uploadItem: {
    type: Object as PropType<TITLEOPTIONS>,
    default: () => ({}),
  },
});

const isNullObj = ref(true);

const itemInfo = computed(() => {
  if (Object.keys(props.uploadItem).length !== 0) {
    isNullObj.value = false;
  }

  return Object.assign(
    {},
    {
      uploadTime: "上传时间",
      musicName: "音乐名称",
      format: "格式",
      album: "专辑",
      singer: "歌手",
      size: "大小",
    } as TITLEOPTIONS,
    props.uploadItem
  );
});

onMounted(() => {
  nextTick(() => {});
});
</script>
<style scoped lang="scss"></style>
