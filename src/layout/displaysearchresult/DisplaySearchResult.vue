<template>
  <ElContainer>
    <ElHeader class="bg-white" height="36px">
      <HeaderType ref="headerselect" @selectType="selectKeyword" />
    </ElHeader>
    <ElMain>
      <AsayncSuspenseVue>
        <component :is="componentId" :data="searchtype.data"></component>
      </AsayncSuspenseVue>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { nextTick, reactive, ref, shallowRef, watchEffect } from "vue";
import { useRoute } from "vue-router";

import { cloudSearch } from "../../api/displaysearchreult";

import { ElContainer, ElMain, ElHeader } from "element-plus";
import HeaderType from "./components/HeaderType.vue";
import AsayncSuspenseVue from "../../components/suspense/AsayncSuspense.vue";
import SongSearch from "./components/SongSearch.vue";

import LRU from "../explore/LRUCache";
import { musicDetail } from "../../utils/musicDetail";

const route = useRoute();
const headerselect = ref<Headers>(null);
const currentPage = ref(1);
const componentId = shallowRef(SongSearch);
const lru = new LRU();
let requestType = null;
let keywords = null;

const searchtype = reactive({
  data: [],
  type: "",
});

const keyword = decodeURIComponent(route.query.keyword as string);
const type = decodeURIComponent(route.query.type as string);
console.log(route.query.keyword);

watchEffect(() => {
  let component = null;
  const type = searchtype.type;

  if (type === "单曲" && !(componentId.value != SongSearch)) {
    component = SongSearch;
  }

  componentId.value = component;
});

function musicsongs(data: any[]) {
  searchtype.type = "单曲";
  searchtype.data = data.map((song) => new musicDetail(song));
}

function searchResult(res: any, isget?: boolean) {
  console.log(res.data);
  const songs = res.data.songs;

  if (!isget) {
    const key = keywords[requestType + "_" + currentPage.value];
    lru.put(key, songs);
  }

  if (Number(keywords[requestType]) === 1) {
    musicsongs(songs);
  }
}

function selectKeyword(type: string) {
  nextTick(() => {
    keywords = headerselect.value["keyword"];
    const key = keywords[type + "_" + currentPage.value];
    const data = lru.get(key);

    if (data !== -1) {
      searchResult({ data }, true);
      return;
    }

    if (keywords) {
      cloudSearch(keyword, (requestType = keywords[type])).then(searchResult);
    } else {
      return Promise.reject(type);
    }
  }).catch((err) => {
    console.log(err);

    // cloudSearch(keyword, ).then(searchResult);
  });
}

selectKeyword(type);
</script>
<style scoped lang="scss"></style>
