<template>
  <card-row :col-item="4" :playlist="list">
    <template #default="{ custom }">
      <video-box :videoinfo="custom.playitem" :index="custom.index" />
    </template>
  </card-row>
</template>
<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from "@vue/runtime-core";

import CardRow from "../../../components/card/CardRow.vue";
import VideoBox from "../../../components/videobox/VideoBox.vue";

type MyReturn<T> = T extends (...arg: any) => infer R ? R : never;

const props = defineProps({
  rootlist: {
    type: Array,
    required: true,
  },
});

const list = ref<MyReturn<typeof mvInfo>[]>([]);

const stop = watchEffect(() => {
  if (props.rootlist.length) {
    list.value = props.rootlist.map(mvInfo);
  }
});

function mvInfo(mv: any) {
  return {
    mid: mv.id,
    path: "/video",
    creator: mv.artists.map((u) => ({
      userName: u.name,
      userId: u.id,
    })),
    durationms: 0,
    subscribed: mv.subed,
    coverUrl: mv.cover,
    playTime: mv.playCount,
    name: mv.name,
    x: 225,
    y: 112,
    query: {
      mid: mv.id,
    },
  };
}

onUnmounted(() => {
  stop();
});
</script>
<style scoped lang="scss"></style>
