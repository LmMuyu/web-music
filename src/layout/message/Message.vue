<template>
  <ElRow class="flex h-full overflow-hidden border_radius">
    <ElCol :span="7" class="solide_border">
      <el-container class="h-full container">
        <el-header class="flex items-center justify-center">
          <Search
            class="border border-gray-300 border-solid rounded-md"
            :isroot-class="false"
            :disabled="false"
            :returnresdata="returnresdata"
          />
        </el-header>
        <el-main class="h-full main_padding">
          <MessagePrivateLetter
            @viewmsg="findViewMsg"
            :privateLetterList="privateLetter.main"
          />
        </el-main>
      </el-container>
    </ElCol>
    <ElCol :span="12">
      <MessageChatBox :viewMsg="privateLetter.viewMsg" />
    </ElCol>
    <ElCol :span="5"> dawd</ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { reactive } from "@vue/reactivity";
import { useStore } from "vuex";

import { getPrivateLetter, getUserMessage } from "../../api/message";
import LRU from "../../utils/LRUCache";

import { ElRow, ElCol, ElHeader, ElMain, ElContainer } from "element-plus";
import MessagePrivateLetter from "./components/MessagePrivateLetter.vue";
import MessageChatBox from "./components/MessageChatBox.vue";
import Search from "../../components/search/Search.vue";

const store = useStore();
const LRUcatch = new LRU();

const returnresdata = (data: any) => {
  console.log(data);
};

const privateLetter = reactive({
  main: [],
  viewMsg: [],
  storeMsg: [],
});

const findViewMsg = (id: number) => {
  if (privateLetter.storeMsg.length > 0) {
    const msgObj = privateLetter.storeMsg.find(
      (v) => v.config.params.uid === id
    );

    privateLetter.viewMsg = msgObj;
  }
};

const watchStep = store.watch(
  () => store.state.userInfo,
  async (value) => {
    if (!value) return;
    const list = await getPrivateLetter();
    privateLetter.main = list.data.msgs;

    const privateMesList = await getUserMessage(list);
    privateLetter.storeMsg = privateMesList;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  watchStep();
});
</script>
<style scoped lang="scss">
.border_radius {
  box-shadow: 0 0 1px 2px #f5f6fa;
  border-radius: 8px;
  .solide_border {
    border-right: 1px solid #f5f6fa;
  }
}

.container {
  &:deep(.main_padding) {
    padding-top: 1.5rem !important;
    padding-right: 0 !important;
    padding-bottom: 1.5rem !important;
    padding-left: 0 !important;
  }
}
</style>
