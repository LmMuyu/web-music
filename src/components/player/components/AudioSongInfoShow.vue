<template>
  <div style="width: 48px; height: 48px" class="flex items-center justify-center">
    <router-link
      :to="{
        path: '/playlist',
        query: {
          id: musicinfo?.id,
        },
      }"
    >
      <ElAvatar shape="square" :src="musicinfo?.picUrl + '?param=48y48'" :alt="musicinfo?.name" />
    </router-link>
  </div>
  <div>
    <div class="flex justify-center flex-col ml-4 truncate text-gray-700">
      <router-link
        :to="{
          path: '/playlist',
          query: {
            id: musicinfo?.id,
          },
        }"
      >
        <span class="flex-1 cursor-pointer decoration" :title="musicinfo?.name">{{
          musicinfo?.name
        }}</span>
      </router-link>
      <span
        class="text-sm flex-1 decoration"
        :title="musicinfo?.nickName"
        v-html="musicinfo?.nickName"
      ></span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";

import { ElAvatar } from "element-plus";

import type { musicDetail as MusicDetail } from "../../../utils/musicDetail";

const props = defineProps({
  musicinfo: {
    type: Object as PropType<MusicDetail>,
  },
});
</script>
<style scoped lang="scss"></style>
