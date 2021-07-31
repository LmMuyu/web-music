<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <p>{{ userinfo.nickname }}</p>
      <p class="text-sm mx-2" style="color: #b2bec3">{{ eventType }}</p>
    </div>
    <div>
      <p>2021-4-5</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  userinfo: {
    type: Object,
    default: () => {},
  },
  type: {
    type: Number,
    required: true,
  },
});

const eventType = computed(() => {
  switch (props.type) {
    case 13:
      return "分享歌单";
    case 17:
      return "分享电台节目";
    case 18:
      return "分享单曲";
    case 19:
      return "分享专辑";
    case 21:
      return "分享视频";
    case 22:
      return "转发";
    case 24:
      return "分享专栏文章";
    case 28:
      return "分享电台节目";
    case 35:
      return "分享歌单";
    case 39:
      return "发布视频";
    case 41:
      return "分享视频";
    default:
      return "";
  }
});
</script>
<style scoped lang="scss"></style>
