<template>
  <component
    :bannerLsit="bannerLsit"
    :hotList="hotList"
    :playList="playList"
    :is="componentName"
  ></component>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "@vue/runtime-dom";
import { ref, shallowRef } from "@vue/reactivity";

const DiscoverIndex = defineAsyncComponent(
  () => import("./layout/DiscoverIndex.vue")
);

import axios from "axios";
import { getPlayList } from "../../../api/discover/getPlaylist";
import { getHot } from "../../../api/discover/getHot";
import { getBanner } from "../../../api/index/index";

const bannerLsit = ref([]);
const hotList = ref([]);
const playList = ref([]);

let componentName = shallowRef(DiscoverIndex);

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
