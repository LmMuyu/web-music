<template>
  <div>
    <router-link
      :to="{ path: '/playlist', query: { id: track.id } }"
      target="_blank"
      class="block w-full px-4"
    >
      <ElRow :class="class">
        <ElCol :span="10" class="flex">
          <div>
            <ElImage :lazy="true" shape="square" :src="track.picUrl" class="w-10 h-10 rounded-md" />
          </div>
          <div class="flex flex-col w-full px-2">
            <span>{{ track.name }}</span>
            <span class="text-sm" v-html="track.nickName"></span>
          </div>
        </ElCol>
        <ElCol :span="10" class="flex items-center text-sm">{{ track.name }}</ElCol>
        <ElCol :span="4" class="flex items-center">
          <!-- <span> {{ track. }} </span> -->
        </ElCol>
      </ElRow>
    </router-link>
  </div>
</template>
<script setup lang="ts">
import { ElRow, ElCol, ElImage } from "element-plus";
import { PropType } from "vue";

import type { musicDetail } from "../../utils/musicDetail";

const props = defineProps({
  track: {
    type: Object as PropType<musicDetail>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    default: "",
  },
});
</script>
<style scoped lang="scss"></style>
