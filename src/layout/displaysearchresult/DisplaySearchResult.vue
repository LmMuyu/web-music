<template>
  <ElContainer class="w-full h-full bg-white">
    <ElHeader height="40px">
      <HeaderType :keyword="typekeyword" @selectType="selectKeyword" />
    </ElHeader>
    <ElMain
      class="relative pt-4"
      :style="{
        overflow: hidden ? 'hidden' : 'auto',
      }"
      style="padding: 0 !important"
    >
      <AsayncSuspense>
        <component :is="componentId" :data="searchtype.data"></component>
      </AsayncSuspense>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { onUnmounted, reactive, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";

import { cloudSearch } from "../../api/displaysearchreult";

import { ElContainer, ElMain, ElHeader } from "element-plus";
import HeaderType from "./components/HeaderType.vue";
import AsayncSuspense from "../../components/suspense/AsayncSuspense.vue";
import DisplaySongSearch from "./components/DisplaySongSearch.vue";
import DisplaySinger from "./components/DisplaySinger.vue";
import DisplayAlbum from "./components/DisplayAlbum.vue";
import DisplayMv from "./components/DisplayMv.vue";

import LRU from "../explore/LRUCache";
import { musicDetail } from "../../utils/musicDetail";

const route = useRoute();
const currentPage = ref(1);
const componentId = shallowRef(null);
const hidden = ref(false);

const searchtype = reactive({
  data: [],
  type: "",
});

const lru = new LRU();
const countpages = ref();
let requestType = null;
let keyword = decodeURIComponent(route.query.keyword as string);
let type = decodeURIComponent(route.query.type as string);

const MAX_RECALL = 5;

const typekeyword = {
  1: "单曲",
  10: "专辑",
  100: "歌手",
  1000: "歌单",
  1002: "用户",
  1004: "MV",
  1006: "歌词",
  1009: "电台",
  1014: "视频",
  1018: "综合",
  2000: "声音",
};

//工具函数

class hiddenComps {
  private comps: any[];
  constructor() {
    this.comps = [DisplaySongSearch, DisplayMv];
  }

  someApply(comp) {
    return this.comps.some((includecomp) => includecomp == comp);
  }
}

const isHiddenComp = (comp) => new hiddenComps().someApply(comp);

//模块函数
const stopWatchComp = watch(componentId, (comp) => {
  if (isHiddenComp(comp)) {
    if (componentId.value) {
      hidden.value = true;
    }
  } else {
    hidden.value = false;
  }
});

function mappingmap(keyword: typeof typekeyword) {
  const keytovalue = new Map(),
    valuetokey = new Map();

  for (const key in keyword) {
    keytovalue.set(key, keyword[key]);
    valuetokey.set(keyword[key], key);
  }

  return {
    keytovalue,
    valuetokey,
  };
}

const { keytovalue, valuetokey } = mappingmap(typekeyword);

async function swithCoponent(type: string) {
  let component = null;
  type = type.trim();

  switch (type) {
    case "歌手":
      component = DisplaySinger;
      break;
    case "单曲":
      component = DisplaySongSearch;
      break;
    case "专辑":
      component = DisplayAlbum;
      break;
    case "MV":
      component = DisplayMv;
      break;
    default:
      throw new Error(`无法找到对应${type}名称组件`);
  }

  if (component) {
    componentId.value = component;
  }
}

function musicSongs(data: any[]) {
  searchtype.type = "单曲";
  searchtype.data = data.map((song) => new musicDetail(song));
}

function musicSinger(data: any[]) {
  searchtype.type = "歌手";
  searchtype.data = data;
}

function musicAlbum(data: any[]) {
  searchtype.type = "专辑";
  searchtype.data = data;
}

function musicMv(data: any[]) {
  searchtype.type = "MV";
  searchtype.data = data;
}

function selectKeyword(selecttype: string) {
  const classift = valuetokey.get(selecttype);
  if (!classift) return console.log(classift + "无值");
  swithCoponent(selecttype);

  const key = selecttype + "_" + currentPage.value;
  requestType = selecttype;

  const data = lru.get(key);
  if (data !== -1) {
    searchResult({ data }, true);
    return;
  }

  cloudSearch(keyword, classift).then(searchResult);
}

selectKeyword(type);

async function searchResult(res: any, isget?: boolean) {
  try {
    const resultdata = res.data.result;
    const lists = searchResultLists(requestType, resultdata);

    if (!lists) {
      throw new Error("lists:为undefined");
    }

    if (!isget) {
      const key = requestType + "_" + currentPage.value;
      lru.put(key, lists);
    }
  } catch (error) {
    console.log(error);
  }
}

function searchResultLists(type: string, resultdata: Object) {
  let list = null;
  searchtype.data = [];
  console.log(resultdata);

  switch (type) {
    case "单曲":
      list = resultdata["songs"];
      musicSongs(list);
      break;
    case "歌手":
      list = resultdata["artists"];
      musicSinger(list);
      break;
    case "专辑":
      list = resultdata["albums"];
      countpages.value = resultdata["albumCount"];
      musicAlbum(list);
      break;
    case "MV":
      list = resultdata["mvs"];
      countpages.value = resultdata["mvCount"];
      musicSinger(list);
      break;
    default:
      throw new Error(`无法找到对应${type}名称组件`);
  }

  return list;
}

//生命周期
onUnmounted(() => {
  stopWatchComp();
});
</script>
<style scoped lang="scss"></style>
