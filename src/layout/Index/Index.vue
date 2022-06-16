<template>
  <el-container class="h-full" style="background: rgb(245, 248, 255)">
    <el-header class="bg-white flex items-center" height="54px">
      <IndexHeaderModule />
    </el-header>
    <el-main class="flex flex-col h-full scrollbar" style="padding: 16px 0 !important">
      <AsayncSuspense>
        <IndexBanner :banner-data="bannerImages" />
        <IndexRecommended />
        <IndexDiscover />
        <IndexRecentlyAlbums />
        <IndexHotsong />
        <IndexFeaturedSinger />
        <IndexHotPlaylists :playList="playList" />
      </AsayncSuspense>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { getBanner as getBannerImages, getHot, getPlayList } from "../../api/index";

import IndexHotsong from "./components/IndexHotsong.vue";
import IndexDiscover from "./components/IndexDiscover.vue";
import { ElContainer, ElHeader, ElMain } from "element-plus";
import IndexBanner from "../../components/banner/Banner.vue";
import IndexRecommended from "./components/IndexRecommended.vue";
import IndexHeaderModule from "./components/IndexHeaderModule.vue";
import IndexHotPlaylists from "./components/IndexHotPlaylists.vue";
import IndexRecentlyAlbums from "./components/IndexRecentlyAlbums.vue";
import IndexFeaturedSinger from "./components/IndexFeaturedSinger.vue";

import type { AxiosResponse } from "axios";

const bannerImages = ref([]);
const hotList = ref([]);
const playList = ref([]);

function requestThenFn(value: AxiosResponse<any>) {
  let url = value.config.url;

  if (!url) {
    return;
  }

  const index = value.config.url.indexOf("?");

  if (index > -1) {
    url = value.config.url.slice(0, index);
  }

  if (url === "/banner") {
    bannerImages.value = value.data.banners;
  } else if (url === "/playlist/hot") {
    hotList.value = value.data.tags;
  } else if (url === "/top/playlist") {
    playList.value = value.data.playlists;
  } else {
    console.log(url + "url数据无法写入");
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
    limit: 6,
  },
}).then(requestThenFn);
</script>
<style scoped lang="scss">
.scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
