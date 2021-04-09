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
            <ElRow>
              <ElCol :span="19">
                <DiscoverHot :categoryname="hotList" />
                <DiscoverPlaylist :playlist="playList" />
              </ElCol>
              <ElCol :span="5">
                <div>
                  <UserProfile />
                </div>
              </ElCol>
            </ElRow>
          </div>
        </article>
      </div>
      <div style="width: 16.666%"></div>
    </div>
  </div>
</template>
<script setup>
import DiscoverPlaylist from "../components/DiscoverPlaylist.vue";
import DiscoverHot from "../components/DiscoverHot.vue";
import { bannerFilter } from "../api/bannerFilter";
import Banner from "/comps/banner/Banner.vue";
import { defineProps, onMounted } from "vue";
import { ref } from "@vue/reactivity";
import axios from "axios";
import { ElRow, ElCol } from "element-plus";

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
  margin-left: 16px;
  margin-right: 16px;
}
</style>
