<template>
  <el-container>
    <el-header height="40px">
      <IndexHeaderModule />
    </el-header>
    <el-main class="flex flex-col">
      <IndexBanner :banner-data="bannerImages" />
      <AsayncSuspense>
        <IndexRecommended />
      </AsayncSuspense>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { getBanner as getBannerImages, getHot, getPlayList } from "../../api/index";

import IndexHeaderModule from "./components/IndexHeaderModule.vue";
import { ElContainer, ElHeader, ElMain } from "element-plus";
import IndexBanner from "../../components/banner/Banner.vue";
import IndexRecommended from "./components/IndexRecommended.vue";

import type { AxiosResponse } from "axios";

const bannerImages = ref([]);
const hotList = ref([]);
const playList = ref([]);

function requestThenFn(value: AxiosResponse<any>) {
  if (value.config.url === "/banner") {
    bannerImages.value = value.data.banners;
  } else if (value.config.url === "/playlist/hot") {
    hotList.value = value.data.tags;
  } else {
    playList.value = value.data.playlists;
  }
}

const fucpalyList = getPlayList();

getBannerImages({
  url: "/banner",
  params: { type: 0 },
}).then(requestThenFn);

getHot({
  url: "/playlist/hot",
}).then(requestThenFn);

fucpalyList({
  url: "/top/playlist",
  params: {
    limit: 18,
  },
}).then(requestThenFn);
</script>
0
<style scoped lang="scss"></style>
