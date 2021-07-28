<template>
  <ElRow class="flex h-full overflow-hidden relative border_radius">
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
        <el-main ref="msgmain" class="h-full relative main_padding">
          <MessagePrivateLetter
            v-if="countRef"
            @viewmsg="findViewMsg"
            :privateLetterList="privateLetter.main"
          />
        </el-main>
      </el-container>
    </ElCol>
    <ElCol class="w-full h-full absolute right-0 top-0" :span="17">
      <MessageChatBox
        @emitRequest="onEmitRequest"
        v-if="privateLetter.viewMsg.length > 0"
        :viewMsg="privateLetter.viewMsg"
      />
      <MessageBackground v-else />
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { onMounted, nextTick, watch } from "@vue/runtime-core";
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";

import {
  getPrivateLetter,
  getUserMessageList,
  getUserMessage,
} from "../../api/message";
import { createLoading } from "../../components/loading/app";
import { promptbox } from "../../components/promptBox";
import LRU from "../../utils/LRUCache";

import { ElRow, ElCol, ElHeader, ElMain, ElContainer } from "element-plus";
import MessagePrivateLetter from "./components/MessagePrivateLetter.vue";
import MessageBackground from "./components/MessageBackground.vue";
import MessageChatBox from "./components/MessageChatBox.vue";
import Search from "../../components/search/Search.vue";

const store = useStore();
const LRUcatch = new LRU();

const msgmain = ref<any | null>(null);
const { countRef, isMountApp, mountApp, negate, unmountApp } =
  new createLoading();

const returnresdata = (data: any) => {
  console.log(data);
};

const privateLetter = reactive({
  main: [],
  viewMsg: [],
  storeMsg: [],
});

const onEmitRequest = async (id: number) => {
  const viewmsg = privateLetter.viewMsg;
  const storemsg = privateLetter.storeMsg;

  if (viewmsg[0].id === id) {
    const result = await getUserMessage(id, viewmsg[1].length + 5);

    privateLetter.viewMsg[1].push(
      ...result.data.msgs.slice(viewmsg.length + 1)
    );

    LRUcatch.put(id, result);
  }
};

const findViewMsg = (useroptions: Record<string, any>) => {
  const res = LRUcatch.get(useroptions.id);

  if (res !== -1) {
    privateLetter.viewMsg.push(useroptions, res.data.msgs);
    return;
  }

  if (privateLetter.storeMsg.length > 0) {
    const msgObj = privateLetter.storeMsg.find(
      (v) => v.config.params.uid === useroptions.id
    );

    if (!msgObj) {
      return promptbox({
        title: "无法找到对应用户信息",
      });
    }

    LRUcatch.put(useroptions.id, msgObj);

    console.log(LRUcatch.viewAllCache());

    privateLetter.viewMsg.length = 0;
    privateLetter.viewMsg.push(useroptions, msgObj.data.msgs);
  }
};

const watchStep = store.watch(
  () => store.state.userInfo,
  async (value) => {
    try {
      if (!value) return;
      const list = await getPrivateLetter();
      privateLetter.main = list.data.msgs;

      const privateMesList = await getUserMessageList(list);
      privateLetter.storeMsg = privateMesList;
    } catch (err) {
      console.log(err);
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  nextTick().then(() => {
    if (!isMountApp() && msgmain.value) {
      mountApp(msgmain.value.$el);

      const stepWatch = watch(
        () => privateLetter.main,
        () => {
          unmountApp(negate) && stepWatch();
        }
      );
    }
  });

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
