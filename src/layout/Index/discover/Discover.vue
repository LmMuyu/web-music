<template>
  <component
    :bannerLsit="bannerLsit"
    :hotList="hotList"
    :playList="playList"
    :is="componentName"
  ></component>

  <!-- <DiscoverIndex
    :bannerLsit="bannerLsit"
    :hotList="hotList"
    :playList="playList"
  /> -->
</template>

<script setup>
import { getPlayList } from "../../../api/discover/getPlaylist";
import { defineAsyncComponent, nextTick } from "@vue/runtime-dom";
import { getHot } from "../../../api/discover/getHot";
import { getBanner } from "../../../api/index/index";
import { ref, shallowRef } from "@vue/reactivity";
import axios from "axios";

const Loading = defineAsyncComponent(() =>
  import("../../../components/loading/Loading.vue")
);
const DiscoverIndex = defineAsyncComponent(() =>
  import("./layout/DiscoverIndex.vue")
);

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

    // nextTick(() => (componentName.value = DiscoverIndex));
  } catch (err) {
    console.log(err);
  }
}

getBannerData();
</script>

<style scoped></style>
