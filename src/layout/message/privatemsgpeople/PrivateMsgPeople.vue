<template>
  <el-container class="h-full container">
    <el-header class="flex justify-center">
      <div>
        <PeopleSearch
          class="border border-gray-300 border-solid rounded-md"
          :isroot-class="false"
        />
      </div>
    </el-header>
    <el-main ref="msgmain" class="h-full relative main_padding">
      <MessagePrivateLetter
        :privateLetterList="letterList"
        v-if="letterList.length > 0"
      />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
// @retNicknameInfo="findViewMsg"
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { createLoading } from "../../../components/loading/app";

import MessagePrivateLetter from "../components/MessagePrivateLetter.vue";
import PeopleSearch from "../../../components/search/Search.vue";

import { ElHeader, ElContainer, ElMain } from "element-plus";

const route = useRoute();
const store = useStore();

// const { countRef, isMountApp, mountApp, negate, unmountApp } =
//   new createLoading();

const letterList = computed(() => store.getters["message/retLetterList"]);
</script>
<style scoped lang="scss">
.container {
  &:deep(.main_padding) {
    padding-top: 0rem !important;
    padding-right: 0 !important;
    padding-bottom: 0rem !important;
    padding-left: 0 !important;
  }
}
</style>
