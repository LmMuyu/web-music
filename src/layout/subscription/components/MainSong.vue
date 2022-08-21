<template>
  <router-link
    :to="{
      path: '/playlist',
      query: { id: songData.id },
    }"
    class="w-full"
    :class="active ? '#EBEEF5' : '#f5f5f5'"
    @mouseleave="active = false"
    @mousecenter="active = false"
  >
    <section class="w-full my-6 flex items-center px-2">
      <div class="h-full relative">
        <ElImage
          :src="songData.picUrl + '?param=42y42'"
          class="object-cover"
          fit="cover"
          style="width: 42px; height: 42px"
          :alt="songData.name"
        />
      </div>
      <div class="flex flex-col justify-around ml-4 decor">
        <div ref="musicname"></div>
        <div class="flex items-center text-xs" style="color: #909399">
          <router-link
            v-for="(singer, index) in songData.singer"
            class="decor"
            :to="{ path: '/user/home', query: { uid: singer.id } }"
            :key="index"
          >
            {{ singer.name + (index !== songData.singer.length - 1 && "/") }}
          </router-link>
        </div>
      </div>
    </section>
  </router-link>
</template>
<script setup lang="tsx">
import { defineProps, onMounted, ref, nextTick } from "vue";

import { ElImage } from "element-plus";

import { routerLinkRender } from "../renderNode";

const props = defineProps({
  songData: {
    type: Object,
    default: () => ({}),
  },
});

const musicname = ref(null);
const musicnickname = ref(null);
const active = ref(false);

onMounted(async () => {
  await nextTick();
  if (musicname.value) {
    routerLinkRender(
      musicname,
      { id: props.songData.id, style: { color: "#303133" }, class: "bottom_line" },
      <span class="decor text-sm">{props.songData.name}</span>
    );
  }
});
</script>
<style scoped lang="scss"></style>
