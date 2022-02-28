<template>
  <el-container class="h-full container">
    <el-header class="flex justify-center">
      <PeopleSearch class="border border-gray-300 border-solid rounded-md" :isroot-class="false" />
    </el-header>
    <el-main ref="msgmain" class="h-full relative main_padding">
      <MessagePrivateLetter :privateLetterList="letterList" v-if="letterList.length > 0" />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
// import Trid from "../hook/trid";
import { getSendMsgUser } from "../../../api/message";

import MessagePrivateLetter from "./MessagePrivateLetter.vue";
import PeopleSearch from "../../../components/search/Search.vue";
import { ElHeader, ElContainer, ElMain } from "element-plus";
import { ref } from "vue";

// const trid = new Trid();

const letterList = ref([]);

getSendMsgUser().then((senduser) => {
  console.log(senduser);
});

// watchEffect(() => {
//   letterList.value.map((people) => {
//     const nickname = people.fromUser.nickname;
//     trid.insert(nickname);
//   });
// });
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
