<template>
  <ElRow class="flex h-full overflow-hidden relative border_radius">
    <ElCol :span="7" class="solide_border">
      <message-user :letterList="letterList" @find-follow-mess="findFollowInfo" />
    </ElCol>
    <ElCol class="w-full h-full absolute right-0 top-0 bg-white" :span="17">
      <!-- <MessageChatBox @emitRequest="onEmitRequest" v-if="privateLetter.viewMsg.length > 0"
        :viewMsg="privateLetter.viewMsg" /> -->
      <MessageBackground />
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";

import { getFollowUserMessage, getSendMsgUser } from "../../api/message";
import { FocusTheUser } from "./hook/factory";
import LRU from "../explore/LRUCache";
import followLetterInfo from "./hook/followLetterInfo";
import letterDexie from "./hook/letterDexie";

import MessageBackground from "./components/MessageBackground.vue";
import MessageChatBox from "./components/MessageChatBox.vue";
import MessageUser from "./components/MessageUser.vue";
import { ElRow, ElCol } from "element-plus";

const dexie = new letterDexie();
const letterList = ref<FocusTheUser[]>([]);
// const letterContent =

const beforePageTime = new Map<number, number[]>();

// 9003
// 1650190229575

dexie.setLastTimes(9003,159441515)

getSendMsgUser().then((senduser) => {
  letterList.value = senduser.data.msgs.map((follow) => new FocusTheUser(follow));
});

async function findFollowInfo(clickFollowInfo: any) {
  try {
    const followMess = await getFollowUserMessage(clickFollowInfo.id);
    const letterContent: followLetterInfo[] = followMess.data.msgs
      .map((mse) => new followLetterInfo(mse))
      .reverse();

    setBeforePageTime(clickFollowInfo.id, letterContent);
    Promise.resolve().then(() => setLetterInfoToIndexDB(clickFollowInfo.id, letterContent));
  } catch (error) {
    console.error("无法请求用户私信信息==>", error);
  }
}

function setBeforePageTime(id: number, letterContent: followLetterInfo[]) {
  const lasttimes = beforePageTime.get(id);
  beforePageTime.set(
    id,
    lasttimes
      ? [...lasttimes, letterContent[letterContent.length - 1].time]
      : [letterContent[letterContent.length - 1].time]
  );
}

async function setLetterInfoToIndexDB(uid: number, letterContent: followLetterInfo[]) {
  const lasttime = letterContent[letterContent.length - 1].time;
  const res = await dexie.setLetterInfoLists(
    letterContent.map((value) => ({ uid, lasttime, letterinfo: value }))
  );
  console.log(res);
}

function setLetterContent(letterContent: followLetterInfo[]) {}

function getLetterIndexDBInfo(uid: number, lasttime: number) {}

function dexieLetterInfos(uid,){
  
}

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
