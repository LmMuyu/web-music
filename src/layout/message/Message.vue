<template>
  <ElRow class="flex h-full overflow-hidden relative border_radius">
    <ElCol :span="7" class="solide_border"> </ElCol>
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
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";

import { getPrivateLetter, getUserMessageList, getUserMessage } from "../../api/message";
import { promptbox } from "../../components/promptBox";
import LRU from "../../utils/LRUCache";

import MessageBackground from "./components/MessageBackground.vue";
import MessageChatBox from "./components/MessageChatBox.vue";

const store = useStore();
const LRUcatch = new LRU();

const msgmain = ref<any | null>(null);

const privateLetter = reactive({
  main: [],
  chatMsgs: [],
  storeMsg: [],
});

const onEmitRequest = async (id: number) => {
  const chatMsgs = privateLetter.chatMsgs;
  const storemsg = privateLetter.storeMsg;

  if (chatMsgs[0].id === id) {
    const result = await getUserMessage(id, chatMsgs[1].length + 5);

    privateLetter.chatMsgs[1].push(...result.data.msgs.slice(chatMsgs.length + 1));

    LRUcatch.put(id, result);
  }
};

const findViewMsg = (useroptions: Record<string, any>) => {
  const res = LRUcatch.get(useroptions.id);

  if (res !== -1) {
    privateLetter.chatMsgs.push(useroptions, res.data.msgs);
    return;
  }

  if (privateLetter.storeMsg.length > 0) {
    const msgObj = privateLetter.storeMsg.find((v) => v.config.params.uid === useroptions.id);

    if (!msgObj) {
      return promptbox({
        title: "无法找到对应用户信息",
      });
    }

    LRUcatch.put(useroptions.id, msgObj);

    privateLetter.chatMsgs.length = 0;
    privateLetter.chatMsgs.push(useroptions, msgObj.data.msgs);
  }
};

store.commit("login/onMittEvent", async (value: any) => {});
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
