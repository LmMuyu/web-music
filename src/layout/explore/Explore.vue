<template>
  <FilterBtnCollections @withTagData="getWithTagData" />
  <FilterCatData :catPlaylists="catPlaylists" />
</template>
<script setup lang="ts">
import { ref } from "vue";

import { topPlaylist } from "../../api/explore";
import { debounce } from "../../utils/debounce";
import LRU from "./LRUCache";

import FilterBtnCollections from "./components/FilterBtnCollections.vue";
import FilterCatData from "./components/FilterCatData.vue";

const catPlaylists = ref([]);

const lru = new LRU();
let isfetch = false;

const _topPlaylist = debounce(topPlaylist, 100, {
  asyncBackcall: toDealWithTopPlaylist,
  quickrequest: true,
});

function toDealWithTopPlaylist(catData: any) {
  isfetch = false;
  const data = catData.data;

  if (!catData.cache) {
    lru.put(data.cat, data.playlists);
    console.log(lru.toviewCache);
  }

  catPlaylists.value = data.playlists ?? data;
}

function getWithTagData(tag: string) {
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

  _topPlaylist(tag);
}
</script>
<style scoped lang="scss"></style>
