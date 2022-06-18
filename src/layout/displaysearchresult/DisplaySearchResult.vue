<template>
  <ElContainer class="w-full h-full bg-white">
    <ElHeader height="40px">
      <header-type
        :keywordlists="typekeyword"
        :type="type ? type : '单曲'"
        @selectType="selectKeyword"
      />
    </ElHeader>
    <ElMain
      class="relative pt-4"
      :style="{
        overflow: hidden ? 'hidden' : 'auto',
      }"
      style="padding: 0 !important"
    >
      <AsayncSuspense>
        <component
          @click-refresh="() => selectKeyword(type)"
          :is="componentId"
          :data="searchtype.data"
          :artistlist="singerLists"
        ></component>
      </AsayncSuspense>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { onUnmounted, reactive, ref, shallowRef, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

import { cloudSearch } from "../../api/displaysearchreult";

import { ElContainer, ElMain, ElHeader } from "element-plus";
import HeaderType from "./components/HeaderType.vue";
import AsayncSuspense from "../../components/suspense/AsayncSuspense.vue";
import DisplaySongSearch from "./components/DisplaySongSearch.vue";
import Loading from "../../components/svgloading/SvgLoading.vue";
import LoadError from "../../components/loaderror/LoadError.vue";
import SingerArtist from "../user/home/components/HomeArtist.vue";
import DisplayAlbum from "./components/DisplayAlbum.vue";
import DisplayMv from "./components/DisplayMv.vue";

import LRU from "../explore/LRUCache";
import { musicDetail } from "../../utils/musicDetail";
import { transformArtistData } from "../user/home/hooks/Home";

const route = useRoute();
const currentPage = ref(1);
const componentId = shallowRef(Loading);
const hidden = ref(false);
const liststype = new Map();

const searchtype = reactive({
  data: [],
  type: "",
});

const lru = new LRU();
const countpages = ref();
let requestType = null;
const keyword = ref(route.query.keyword as string);
const type = ref(route.query.type as string);
const router = useRouter();
const singerLists = ref([]);
let frist = false;

const typekeyword = {
  1: "单曲",
  10: "专辑",
  100: "歌手",
  1000: "歌单",
  1002: "用户",
  1004: "MV",
  1014: "视频",
};

//工具函数

const findTypeKey = (map: Map<string, string>, type: string) =>
  map.has(type) ? map.get(type) : -1;
const setTypeKey = (map: Map<string, string>, type: string, value: string) => map.set(type, value);
const delTypeKey = (map: Map<string, string>, type: string) => map.has(type) && map.delete(type);

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

function musicSongs(data: any[]) {
  searchtype.type = "单曲";
  searchtype.data = data.map((song) => new musicDetail(song));
  componentId.value = DisplaySongSearch;
}

function musicSinger(data: any[]) {
  searchtype.type = "歌手";
  singerLists.value = data.map((singer) => transformArtistData(singer));
  console.log(singerLists.value);
  componentId.value = SingerArtist;
}

function musicAlbum(data: any[]) {
  searchtype.type = "专辑";
  searchtype.data = data;
  componentId.value = DisplayAlbum;
}

function musicMv(data: any[]) {
  searchtype.type = "MV";
  searchtype.data = data;
  componentId.value = DisplayMv;
}

function routerPush(type: string) {
  router.push({
    path: "/searchres",
    query: {
      keyword: keyword.value,
      type,
    },
  });
}

function selectKeyword(selecttype: string) {
  if (selecttype === type.value && frist) return (frist = true);

  const classift = valuetokey.get(selecttype);
  if (!classift) return console.log(classift + "无值");

  const key = selecttype + "_" + currentPage.value;
  requestType = selecttype;

  const lrudata = lru.get(key);

  routerPush(selecttype);
  if (lrudata !== -1) {
    searchResult(lrudata.value, true);
    return;
  }

  delTypeKey(liststype, requestType);
  componentId.value = Loading;
  cloudSearch(keyword.value, classift).then((res) => searchResult(res.data.result));
}

selectKeyword(type.value);

async function searchResult(resultdata: any[], isget?: boolean) {
  try {
    const litstype = findTypeKey(liststype, requestType);
    const lists = searchResultLists(
      requestType,
      litstype === -1
        ? resultdata
        : {
            [litstype]: resultdata,
          }
    );

    if (!lists) {
      throw new Error("lists:为undefined");
    }

    if (!isget) {
      const key = requestType + "_" + currentPage.value;
      lru.put(key, lists);
    }
  } catch (error) {
    console.log(error);
    componentId.value = LoadError as any;
  }
}

function searchResultLists(type: string, resultdata: Object) {
  let list = null;
  searchtype.data = [];

  switch (type) {
    case "单曲":
      list = resultdata["songs"];
      musicSongs(list);
      setTypeKey(liststype, requestType, "songs");
      break;
    case "歌手":
      list = resultdata["artists"];
      musicSinger(list);
      setTypeKey(liststype, requestType, "artists");
      break;
    case "专辑":
      list = resultdata["albums"];
      countpages.value = resultdata["albumCount"];
      setTypeKey(liststype, requestType, "albums");

      musicAlbum(list);
      break;
    case "MV":
      list = resultdata["mvs"];
      countpages.value = resultdata["mvCount"];
      setTypeKey(liststype, requestType, "mvs");
      musicMv(list);
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

onBeforeRouteLeave((grouproute) => {
  if (grouproute.path === route.path) {
    componentId.value = Loading;
  }
});

onBeforeRouteUpdate((route) => {
  const query = route.query;
  type.value = query.type as string;
  keyword.value = query.keyword as string;
});
</script>
<style scoped lang="scss"></style>
