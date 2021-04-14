<template>
  <div class="bg_image">
    <div class="flex">
      <div style="width: 16.666%"></div>
      <div style="width: 66.6656%">
        <Banner :bannerData="bannerLsit" />
        <article
          class="w-full border-solid border-gray-500 border-r border-l border-b h-full"
        >
          <ElRow class="flex h-full">
            <ElCol class="div_translate" :span="18">
              <DiscoverHot :categoryname="hotList" />
              <DiscoverPlaylist :playlist="playList" />
              <div class="mt-16"></div>
              <DiscoverNewDisc />
            </ElCol>
            <ElCol :span="6">
              <aside class="w-full h-full flex">
                <div class="aside_right"></div>
                <Aside />
              </aside>
            </ElCol>
          </ElRow>
        </article>
      </div>
      <div style="width: 16.666%"></div>
    </div>
  </div>
</template>
<script setup>
import DiscoverPlaylist from "../components/DiscoverPlaylist.vue";
import { defineAsyncComponent, defineProps } from "vue";
import DiscoverHot from "../components/DiscoverHot.vue";
import { bannerFilter } from "../api/bannerFilter";
import Aside from "../../asideright/Aside.vue";
import Banner from "/comps/banner/Banner.vue";
import { ElRow, ElCol } from "element-plus";
import { ref } from "@vue/reactivity";

const DiscoverNewDisc = defineAsyncComponent(() =>
  import("../components/DIscoverNewDisc.vue")
);

const props = defineProps({
  bannerLsit: {
    type: Array,
    default: () => [],
  },
  hotList: {
    type: Array,
    default: () => [],
  },
  playList: {
    type: Array,
    default: () => [],
  },
});
</script>
<style lang="scss" scoped>
.bg_image {
  background-size: 6000px;
  background-position: center center;
}

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
