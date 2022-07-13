<template>
  <el-row class="flex w-full bg-white">
    <el-col :span="12">
      <index-nav-tag @loadComps="loadComps" />
    </el-col>
    <el-col :span="6"></el-col>
    <el-col :span="6">
      <IndexSearch v-model="inputValue" :placeholder="keyword.first" />
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, Ref, ref, watch, watchEffect } from "vue";

import { hotSearch } from "../../../api/index";
import { useWatchRoutePath } from "../../../utils/useWatchHost";

import IndexSearch from "../../../components/search/Search.vue";
import IndexNavTag from "../navTag/NavTag.vue";
import { ElRow, ElCol } from "element-plus";

const router = useRouter();

const { keyword, hotSearchKeywordList, isClearTimeout } = retkeyword();

function watchModel(negateRef: Ref<boolean>) {
  const value = ref("");
  let isToPage = false;

  function keyDownEvent(e) {
    if (e.key === "Enter") {
      isToPage = true;
      value.value += " ";
    }
  }

  window.addEventListener("keydown", keyDownEvent, false);

  function inputKeyword(): string {
    const searchValue = value.value.trim();
    if (searchValue === "") {
      return keyword.value.first ? keyword.value.first : "";
    }

    return searchValue;
  }

  watchEffect(() => {
    negateRef.value = value.value !== "" ? true : false;

    if (negateRef.value && isToPage) {
      isToPage = false;

      const searchKeyword = inputKeyword();

      if (searchKeyword !== "") {
        router.push({
          path: "/searchres",
          query: {
            keyword: searchKeyword,
            type: "单曲",
          },
        });
      }
    }
  });

  return value;
}

const inputValue = watchModel(isClearTimeout);

function retkeyword() {
  const route = useRoute();
  const hotSearchKeywordList = [];
  const currentIndex = ref(0);
  const isClearTimeout = ref(false);
  let timer: any = null;

  function claer() {
    clearTimeout(timer);
    timer = null;
  }

  function runTimeout() {
    timer = setTimeout(() => {
      // console.log(currentIndex.value);
      const len = hotSearchKeywordList.length;
      if (currentIndex.value + 1 >= len) {
        currentIndex.value = 0;
      } else {
        currentIndex.value += 1;
      }

      claer();
      runTimeout();
    }, 3000);
  }

  const keyword = computed(() => {
    const keywordstr = hotSearchKeywordList[currentIndex.value];
    if (!keywordstr) return { first: "" };

    return keywordstr;
  });

  runTimeout();

  watchEffect(() => {
    isClearTimeout.value ? claer() : runTimeout();
  });

  const routePath = useWatchRoutePath();
  watch(routePath, (value) => {
    if (route.path !== value.path) {
      console.log(555);
      claer();
    }
  });

  return {
    keyword,
    hotSearchKeywordList,
    isClearTimeout,
  };
}

hotSearch().then(({ data }) => {
  hotSearchKeywordList.push(...data.result.hots);
});

function loadComps(comp: string[]) {
  const compname = comp[0];

  if (router.hasRoute(compname) || router.hasRoute(compname.toLowerCase())) {
    router.push({
      name: compname,
    });
  } else {
    //导航到404
  }
}
</script>
<style scoped lang="scss"></style>
