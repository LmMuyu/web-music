<template>
  <el-container class="h-full" style="background: rgb(245, 248, 255)">
    <el-header class="bg-white" height="40px">
      <IndexHeaderModule />
    </el-header>
    <el-main class="flex flex-col scrollbar">
      <keep-alive>
        <AsayncSuspense>
          <IndexBanner :banner-data="bannerImages" />
          <IndexRecommended />
          <IndexDiscover />
          <IndexRecentlyAlbums />
          <IndexHotsong />
          <IndexFeaturedSinger />
          <IndexHotPlaylists :playList="playList" />
        </AsayncSuspense>
      </keep-alive>
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
  if (value.config.url === "/banner") {
    bannerImages.value = value.data.banners;
  } else if (value.config.url === "/playlist/hot") {
    hotList.value = value.data.tags;
  } else {
    playList.value = value.data.playlists;
    console.log(playList.value);
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
