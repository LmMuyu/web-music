<template>
  <div class="flex items-center relative py-3 border_bar">
    <div class="font_size" style="width: 16.666%">推荐歌曲</div>
    <ul class="flex items-center">
      <p>类别：</p>
      <li
        v-for="(tagItem, index) in discoverMusic"
        :key="index"
        :style="activeStyle(index)"
        @click="
          clickActive(index);
          setCurPos(index);
        "
        @mouseleave="leaveActive(index)"
        @mouseenter="moveActive(index)"
        class="text-sm px-6 cursor-pointer"
      >
        {{ tagItem.tagName }}
      </li>
    </ul>
  </div>
  <!-- <ToplistMainContent
    :open-virtuallist="false"
    :is-checkbox="false"
    :listData="sliceList"
    :close-loading="true"
    :select-all="false"
    :is-rank="false"
  /> -->
</template>
<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";

import { discoverMusic } from "../api/data";
import { activeIndex } from "../../../../utils/activeIndex";
import { getPlaylist } from "../api/methods";

import ToplistMainContent from "../../toplist/components/ToplistMainContent.vue";

const list = ref<any[]>([]);
const curSlicePos = ref(0);

const { activeStyle, clickActive, leaveActive, moveActive } = new activeIndex();

getPlaylist(10).then(
  (res) => (list.value = res.map((v) => v.data.albums.map(forMap)))
);

const forMap = (artistsValue: any) => ({
  id: artistsValue.id,
  ar: [{ name: artistsValue.artists[0].name }],
  al: { name: artistsValue.name },
});

function setCurPos(index: number) {
  curSlicePos.value = index;
}

const sliceList = computed(() => list.value[curSlicePos.value]);
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

.font_size {
  font-size: 21px;
}
</style>
