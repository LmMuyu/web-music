<template>
  <el-container class="h-full container">
    <el-main ref="msgmain" class="h-full relative bg-white main_padding">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="私信" name="allmess">
          <MessagePrivateLetter
            @retNicknameInfo="(data) => ctxEmit('findFollowMess', data)"
            :privateLetterList="letterList"
            v-if="letterList?.length > 0 && showTabModule === '0'"
          ></MessagePrivateLetter>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <MessageComment v-if="showTabModule === '1'" />
        </el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { defineAsyncComponent, PropType, ref, unref } from "vue";

import { FocusTheUser } from "../hook/factory";

import { ElContainer, ElMain, ElTabs, ElTabPane } from "element-plus";

const MessagePrivateLetter = defineAsyncComponent(() => import("./MessagePrivateLetter.vue"));
const MessageComment = defineAsyncComponent(() => import("./MessageComment.vue"));

import type { TabsPaneContext } from "element-plus";

const ctxEmit = defineEmits(["findFollowMess"]);

const props = defineProps({
  letterList: {
    type: Array as PropType<FocusTheUser[]>,
    require: true,
  },
});

const activeName = ref("allmess");
const showTabModule = ref("0");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  showTabModule.value = unref(tab.index);
};
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

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
