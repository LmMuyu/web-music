<template>
  <BetterScroll :isminusviewposth="true" :open-h-render="false">
    <router-link
      v-for="(playlist, index) in data"
      :key="index"
      :to="{
        path: '/songdetail',
        query: {
          id: playlist.id,
        },
      }"
    >
      <ElRow
        class="py-2 cursor-pointer"
        :align="'middle'"
        :style="{
          backgroundColor:
            activeIndex === index ? '#F0F2F5' : index % 2 > 0 ? '#fafafa' : '#ffffff',
        }"
        @mouseenter="activeIndex = index"
        @mouseleave="activeIndex = null"
      >
        <ElCol :span="2">
          <el-image
            class="w-16 h-16 rounded-md"
            :src="playlist.playlistUrl + '?param=64y64'"
          ></el-image>
        </ElCol>
        <ElCol class="text-sm" style="color: #303133" :span="10">
          {{ playlist.playlistname }}
        </ElCol>
        <ElCol :span="4" class="text-xs" style="color: #dedfe0">
          {{ playlist.playlistcount }}首
        </ElCol>
        <ElCol :span="8" class="text-xs">
          <span style="color: #dedfe0">by</span>
          <span style="color: #606266" class="px-2">
            {{ playlist.creator.nickname }}
          </span>
        </ElCol>
      </ElRow>
    </router-link>
  </BetterScroll>
</template>
<script setup lang="ts">
import { PlayList } from "..";

import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import { ElRow, ElCol, ElImage } from "element-plus";

import { PropType, ref } from "vue";

const props = defineProps({
  data: {
    type: Array as PropType<PlayList[]>,
    default: () => [],
  },
});

const activeIndex = ref(null);
</script>
<style scoped lang="scss"></style>
