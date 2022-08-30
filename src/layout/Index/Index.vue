<template>
  <el-container class="h-full bg-white">
    <el-header class="bg-white flex items-center" height="54px">
      <IndexHeaderModule />
    </el-header>
    <el-main class="flex flex-col h-full scrollbar" style="padding: 16px 0 !important">
      <IndexBanner :banner-data="bannerImages" />
      <el-container style="height: inherit">
        <el-main>
          <IndexRecommended />
        </el-main>
        <el-aside width="350px">
          <IndexHotPlaylists :playList="playList" />
        </el-aside>
      </el-container>
      <AsyncSuspense class="px-2">
        <IndexRecentlyAlbums />
        <IndexHotsong />
        <IndexFeaturedSinger />
      </AsyncSuspense>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { getBanner as getBannerImages, getHot, getPlayList } from "../../api/index";

import IndexHotsong from "./components/IndexHotsong.vue";
import IndexBanner from "../../components/banner/Banner.vue";
import IndexRecommended from "./components/IndexRecommended.vue";
import IndexHeaderModule from "./components/IndexHeaderModule.vue";
import IndexHotPlaylists from "./components/IndexHotPlaylists.vue";
import { ElContainer, ElHeader, ElMain, ElAside } from "element-plus";
import IndexRecentlyAlbums from "./components/IndexRecentlyAlbums.vue";
import IndexFeaturedSinger from "./components/IndexFeaturedSinger.vue";

import type { AxiosResponse } from "axios";
import { RecPlayList } from ".";

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
    playList.value = value.data.playlists.slice(0, 6).map((data) => new RecPlayList(data));
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
