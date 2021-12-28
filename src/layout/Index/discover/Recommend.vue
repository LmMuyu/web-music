<template>
  <div class="flex flex-col">
    <Banner :bannerData="bannerLsit" />
    <RecHot :categoryname="hotList" :playlist="playList" />
    <RecMusic />
     
    <RecMv />
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import axios from "axios";

import { getPlayList } from "../../../api/discover/getPlaylist";
import { getHot } from "../../../api/discover/getHot";
import { getBanner } from "../../../api/index/index";

import Banner from "../../../components/banner/Banner.vue";
import RecMusic from "./components/DiscoverMusic.vue";
import RecMv from "./components/DiscoverMv.vue";
import RecHot from "./components/RecHot.vue";

const bannerLsit = ref([]);
const hotList = ref([]);
const playList = ref([]);

async function getBannerData() {
  try {
    const fucpalyList = getPlayList();

    const [banner, hot, palyList] = await axios.all([
      getBanner({
        url: "/banner",
        params: {
          type: 0,
        },
      }),
      getHot({
        url: "/playlist/hot",
      }),
      fucpalyList({
        url: "/top/playlist",
        params: {
          limit: 18,
        },
      }),
    ]);

    bannerLsit.value = banner.data.banners;
    hotList.value = hot.data.tags;
    playList.value = palyList.data.playlists;
  } catch (err) {
    console.log(err);
  }
}

getBannerData();
</script>

<style lang="scss" scoped>
.div_translate {
  padding-left: 16px;
  padding-right: 16px;
}

.aside_right {
  width: 2px;
  height: inherit;
  background: #b2bec3;
}
</style>
