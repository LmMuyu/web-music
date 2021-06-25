<template>
  <div class="bg_image">
    <Banner :bannerData="bannerLsit" />
    <article ref="discoverContent" class="w-full h-full">
      <DiscoverHot :categoryname="hotList" />
      <DiscoverPlaylist :playlist="playList" />
      <div class="mt-15"></div>
      <DiscoverMusic />
      <div class="mt-16"></div>
      <DiscoverMv />
    </article>
  </div>
</template>
<script setup lang="ts">
const DiscoverBillboard = defineAsyncComponent(
  () => import("../components/DiscoverBillboard.vue")
);

const DiscoverMv = defineAsyncComponent(
  () => import("../components/DiscoverMv.vue")
);

const DiscoverMusic = defineAsyncComponent(
  () => import("../components/DiscoverMusic.vue")
);

import DiscoverPlaylist from "../components/DiscoverPlaylist.vue";
import { defineAsyncComponent, defineProps, ref } from "vue";
import DiscoverHot from "../components/DiscoverHot.vue";
import Banner from "/comps/banner/Banner.vue";

import type { PropType } from "vue";
import type { PlayListOptions } from "../type";

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
    type: Array as PropType<Array<PlayListOptions>>,
    default: () => [],
  },
});

const discoverContent = ref<HTMLElement | null>(null);
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
