<template>
  <div class="relative w-56">
    <div class="relative" @mouseenter="showplayindex = index" @mouseleave="showplayindex = null">
      <router-link to="/">
        <ElImage :src="videoinfo.coverUrl + '?param=224y112'" class="rounded-md w-56 h-28">
        </ElImage>
      </router-link>
      <div
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center bj-show"
        v-if="showplayindex === index"
      >
        <FontIcon size="32" color="#fff" icon="iconbofang2" />
      </div>
      <div class="flex items-center absolute right-0 top-0">
        <FontIcon size="14" color="#fff" icon="iconbofang1" />
        <span class="px-1 text-white text-xs p-2">{{ fromPlayCount(videoinfo.playTime) }}</span>
      </div>
      <div class="absolute right-0 bottom-0 text-white text-xs p-2">
        {{ filterDate(videoinfo.durationms) }}
      </div>
    </div>
    <div class="truncate py-2" style="color: #303133">{{ videoinfo.title }}</div>
    <div style="color: #ebedf0" class="text-sm">
      <span>by:</span>
      <router-link
        :to="{
          path: '/user/home',
          query: {
            uid: creator.userId,
            isself: true,
            issinger: true,
          },
        }"
        class="text_hover"
        v-for="(creator, index) in videoinfo.creator"
      >
        {{ creator.userName + (index !== videoinfo.creator.length - 1 && "/") }}
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import filterDate from "../../utils/filterDate";
import { fromPlayCount } from "../../utils/fromPlayCount";

import { ElImage } from "element-plus";
import FontIcon from "../fonticon/FontIcon.vue";

const props = defineProps({
  videoinfo: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    required: true,
  },
});

console.log(props.videoinfo);

const showplayindex = ref(null);
</script>
<style scoped lang="scss">
.bj-show {
  background-color: rgb(48, 49, 51, 0.3);
}

.text_hover:hover {
  color: #dcdfe6;
}
</style>
