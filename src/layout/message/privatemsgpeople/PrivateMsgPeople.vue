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
import { useRoute } from "vue-router";
import { computed, watchEffect } from "vue";
import { useStore } from "vuex";

import Trid from "../hook/trid";

import MessagePrivateLetter from "../components/MessagePrivateLetter.vue";
import PeopleSearch from "../../../components/search/Search.vue";
import { ElHeader, ElContainer, ElMain } from "element-plus";

const route = useRoute();
const store = useStore();
const trid = new Trid();

const letterList = computed(() => store.getters["message/retLetterList"]);

watchEffect(() => {
  letterList.value.map((people) => {
    const nickname = people.fromUser.nickname;
    trid.insert(nickname);
  });
});
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
