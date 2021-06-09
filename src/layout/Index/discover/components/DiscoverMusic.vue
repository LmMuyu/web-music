<template>
  <div class="flex items-center relative py-3 border_bar">
    <div class="text-3xl">推荐歌曲</div>
    <ul class="flex items-center">
      <li
        v-for="(tagItem, index) in discoverMusic"
        :key="index"
        :style="activeStyle(index)"
        @click="clickActive(index)"
        @mouseleave="leaveActive(index)"
        @mouseenter="moveActive(index)"
        class="px-6 cursor-pointer"
      >
        {{ tagItem }}
      </li>
    </ul>
  </div>
  <!-- <ToplistMainContent /> -->
</template>
<script setup lang="ts">
import { discoverMusic } from "../api/bannerFilter";
import { activeIndex } from "../../../../utils/activeIndex";
import { getPlaylist } from "../api/methods";

import ToplistMainContent from "../../toplist/components/ToplistMainContent.vue";

const { activeStyle, clickActive, leaveActive, moveActive } = new activeIndex();

getPlaylist().then((res) => {
  console.log(res);
});
</script>
<style scoped lang="scss">
.border_bar {
  ::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 2px;
    background-color: #74b9ff;
  }
}
</style>
