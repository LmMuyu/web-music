<template>
  <div
    v-for="(itme, index) in renderlists"
    class="flex py-1 relative"
    :style="{ backgroundColor: bgIndex === index ? '#FAFAFA' : '' }"
    :key="index"
    @mouseenter="bgIndex = index"
    @mouseleave="bgIndex = null"
  >
    <div>
      <el-image
        :src="itme.sharePicUrl + '?param=36y42'"
        style="width: 38px; height: 40px"
        class="rounded-md"
      >
      </el-image>
    </div>
    <div class="flex flex-col px-4 text-sm">
      <span style="white-space: nowrap; color: #303133">
        {{ itme.title ? `#${itme.title}#` : itme.nickname }}
      </span>
      <span style="color: #dfe6e9" class="w-32 truncate text-xs">
        {{ itme.participateCount ? itme.participateCount + "人参与" : itme.msg }}
      </span>
    </div>
    <router-link
      :to="{
        path: toPath,
        query: { tid: itme.actId, topictitle: itme.title },
      }"
      class="absolute top-0 bottom-0 left-0 w-full h-full"
    ></router-link>
  </div>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue";
import { RouterLink } from "vue-router";
import { ElImage } from "element-plus";

const props = defineProps({
  renderlists: {
    type: Array as PropType<any[]>,
    required: true,
  },
  toPath: {
    type: String,
    required: true,
  },
});

const bgIndex = ref(null);
</script>
<style scoped lang="scss"></style>
