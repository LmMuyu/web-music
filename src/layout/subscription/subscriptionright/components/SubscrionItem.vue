<template>
  <div v-for="(itme, index) in renderlists" :key="index" class="flex py-1 relative">
    <div>
      <el-image
        :src="itme.sharePicUrl + '?param=36y42'"
        style="width: 38px; height: 40px"
        class="rounded-md"
      >
      </el-image>
    </div>
    <div class="flex flex-col px-4">
      <p style="white-space: nowrap">
        {{ itme.title ? `#${itme.title}#` : itme.nickname }}
      </p>
      <p style="color: #dfe6e9" class="w-32 truncate text-sm">
        {{ itme.participateCount ? itme.participateCount + "人参与" : itme.msg }}
      </p>
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
import { computed, PropType } from "vue";
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

// console.log(props.renderlists);
</script>
<style scoped lang="scss"></style>
