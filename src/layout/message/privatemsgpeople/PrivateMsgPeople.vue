<template>
  <el-container class="h-full container">
    <el-header class="flex items-center justify-center">
      <!-- <PeopleSearch
        class="border border-gray-300 border-solid rounded-md"
        :isroot-class="false"
        :disabled="false"
        :returnresdata="returnresdata"
      /> -->
    </el-header>
    <el-main ref="msgmain" class="h-full relative main_padding">
      <MessagePrivateLetter :privateLetterList="letterList" />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
// @retNicknameInfo="findViewMsg"
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useStore } from "vuex";

import { createLoading } from "../../../components/loading/app";

import MessagePrivateLetter from "../components/MessagePrivateLetter.vue";
// import PeopleSearch from "../../../components/search/Search.vue";

const route = useRoute();
const store = useStore();

const returnresdata = (data: any) => {
  console.log(data);
};

// const { countRef, isMountApp, mountApp, negate, unmountApp } =
//   new createLoading();

const letterList = computed(() => store.getters["message/retLetterList"]);
</script>
<style scoped lang="scss"></style>
