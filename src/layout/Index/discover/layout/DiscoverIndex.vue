<template>
  <div class="bg_image">
    <Banner :bannerData="bannerLsit" />
    <article class="w-full h-full">
      <DiscoverHot :categoryname="hotList" />
      <DiscoverPlaylist :playlist="playList" />
      <div class="mt-16"></div>
      <DiscoverNewDisc />
      <div class="mt-16"></div>
      <DiscoverBillboard />
    </article>
  </div>
</template>
<script setup lang="ts">
const DiscoverNewDisc = defineAsyncComponent(
  () => import("../components/DIscoverNewDisc.vue")
);
const DiscoverBillboard = defineAsyncComponent(
  () => import("../components/DiscoverBillboard.vue")
);

import DiscoverPlaylist from "../components/DiscoverPlaylist.vue";
import { defineAsyncComponent, defineProps } from "vue";
import DiscoverHot from "../components/DiscoverHot.vue";
import Banner from "/comps/banner/Banner.vue";

import type { PropType } from "vue";

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
    type: Array as PropType<Array<Object>>,
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
