<template>
  <div class="bg_image">
    <div class="flex">
      <div style="width: 16.666%"></div>
      <div style="width: 66.6656%">
        <Banner :bannerData="bannerLsit" />
        <article
          class="w-full border-solid border-gray-500 border-r border-l border-b h-full"
        >
          <div class="div_translate">
            <DiscoverHot :categoryname="hotList" />
            <DiscoverPlaylist :playlist="playList" />
          </div>
        </article>
      </div>
      <div style="width: 16.666%"></div>
    </div>
  </div>
</template>

<script setup>
import DiscoverPlaylist from "./components/DiscoverPlaylist.vue";
import DiscoverHot from "./components/DiscoverHot.vue";
import { getHot } from "../../../api/discover/getHot";
import { getPlayList } from "../../../api/discover/getPlaylist";
import { getBanner } from "../../../api/index/index";
import { bannerFilter } from "./api/bannerFilter";
import Banner from "/comps/banner/Banner.vue";
import { ref } from "@vue/reactivity";
import { onMounted } from "vue";
import axios from "axios";

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

onMounted(() => {
  // ["left", "right"].map((position) => {
  //   const className = `el-icon-arrow-${position}`;
  //   const el: Element = document.getElementsByClassName(className)[0];
  //   const element = el as HTMLElement;
  //   element.style.fontFamily = "iconfont !important";
  //   element.style.fontSize = 24 + "px";
  //   element.style.fontStyle = "normal";
  //   element.style.fontSmoothing
  //   el.classList.remove(className);
  //   el.classList.add(...["iconicon-"]);
  // });
});
</script>

<style scoped>
.bg_image {
  background-size: 6000px;
  background-position: center center;
}

.div_translate {
  margin-left: 16px;
  margin-right: 16px;
}
</style>
