<template>
  <div class="bg-white" style="height: 100vh">
    <better-scroll
      v-if="catPlaylists.length > 0"
      :isminusviewposth="true"
      :open-h-render="false"
      :item-len="catPlaylists.length"
      :open-upload="true"
      @pullUpLoad="pullUpLoad"
    >
      <FilterBtnCollections @withTagData="getWithTagData" />
      <filter-cat-data :catPlaylists="catPlaylists" />
    </better-scroll>

    <div class="h-full flex justify-center items-center" v-else>
      <svg-loading></svg-loading>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { topPlaylist } from "../../api/explore";
import { debounce } from "../../utils/debounce";
import LRU from "./LRUCache";

import FilterBtnCollections from "./components/FilterBtnCollections.vue";
import FilterCatData from "./components/FilterCatData.vue";
import SvgLoading from "../../components/svgloading/SvgLoading.vue";
import BetterScroll from "../../components/betterscroll/BetterScroll.vue";

const catPlaylists = ref([]);

const lru = new LRU();
let isfetch = false;
const loadDataing = ref(true);

function pullUpLoad() {
  console.log(55);
}

const _topPlaylist = debounce(topPlaylist, 100, {
  asyncBackcall: toDealWithTopPlaylist,
  quickrequest: true,
});

function toDealWithTopPlaylist(catData: any) {
  isfetch = false;
  const data = catData.data;

  if (!catData.cache) {
    lru.put(data.cat, data.playlists);
  }

  loadDataing.value = false;
  catPlaylists.value = data.playlists ?? data;
}

function getWithTagData(tag: string) {
  if (tag === "· · ·") return;

  const data = lru.get(tag);

  if (data !== -1) {
    toDealWithTopPlaylist({ data: data.value, cache: true });
    return;
  }

  if (!isfetch) {
    isfetch = true;
  } else {
    _topPlaylist.clearTimes();
    isfetch = true;
  }

  loadDataing.value = true;
  _topPlaylist(tag);
}

getWithTagData("全部");
</script>
<style scoped lang="scss">
.container_height {
  height: calc(100% - 88px);
}
</style>
