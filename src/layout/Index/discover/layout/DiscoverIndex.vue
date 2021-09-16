<template>
  <div class="flex flex-col">
    <div style="height: 15%">
      <Banner :bannerData="bannerLsit" />
    </div>
    <div style="height: 20%">
      <DiscoverHot :categoryname="hotList" />
    </div>
    <div style="height: 20%">
      <DiscoverPlaylist :playlist="playList" />
    </div>
    <div style="height: 20%">
      <DiscoverMusic />
    </div>
    <div style="height: 25%">
      <DiscoverMv />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, defineProps, ref } from "vue";

import DiscoverPlaylist from "../components/DiscoverPlaylist.vue";
import Banner from "../../../../components/banner/Banner.vue";
import DiscoverHot from "../components/DiscoverHot.vue";
import { ElRow, ElCol } from "element-plus";

const DiscoverBillboard = defineAsyncComponent(
  () => import("../components/DiscoverBillboard.vue")
);

const DiscoverMv = defineAsyncComponent(
  () => import("../components/DiscoverMv.vue")
);

const DiscoverMusic = defineAsyncComponent(
  () => import("../components/DiscoverMusic.vue")
);

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
