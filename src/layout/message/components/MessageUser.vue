<template>
  <el-container class="h-full container">
    <el-header height="54px" class="flex justify-center items-center bg-white">
      <people-search class="border border-gray-300 border-solid rounded-md" :isroot-class="false" />
    </el-header>
    <el-main ref="msgmain" class="h-full relative bg-white main_padding">
      <MessagePrivateLetter
        @retNicknameInfo="(data) => ctxEmit('findFollowMess', data)"
        :privateLetterList="letterList"
        v-if="letterList?.length > 0"
      />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { PropType } from "vue";

import { FocusTheUser } from "../hook/factory";

import MessagePrivateLetter from "./MessagePrivateLetter.vue";
import PeopleSearch from "../../../components/search/Search.vue";
import { ElHeader, ElContainer, ElMain } from "element-plus";

const ctxEmit = defineEmits(["findFollowMess"]);

const props = defineProps({
  letterList: {
    type: Array as PropType<FocusTheUser[]>,
    require: true,
  },
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
