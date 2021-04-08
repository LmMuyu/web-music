<template>
  <!-- <component
    :bannerLsit="bannerLsit"
    :hotList="hotList"
    :playList="playList"
    :is="componentName"
  ></component> -->
  <!-- <Loading /> -->
  <DiscoverIndex
    :bannerLsit="bannerLsit"
    :hotList="hotList"
    :playList="playList"
  />
</template>

<script setup>
import { getPlayList } from "../../../api/discover/getPlaylist";
import { getHot } from "../../../api/discover/getHot";
import { getBanner } from "../../../api/index/index";
import DiscoverIndex from "./layout/DiscoverIndex.vue";
import Loading from "../../../components/loading/Loading.vue";
import axios from "axios";
import { ref } from "@vue/reactivity";

const bannerLsit = ref([]);
const hotList = ref([]);
const playList = ref([]);

let componentName = ref("DiscoverIndex");

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
          limit: 8,
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

<style scoped></style>
