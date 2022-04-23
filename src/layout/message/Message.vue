<template>
  <ElRow class="flex h-full overflow-hidden relative border_radius">
    <ElCol :span="7" class="solide_border">
      <message-user :letterList="letterList" @find-follow-mess="findFollowInfo" />
    </ElCol>
    <ElCol class="w-full h-full absolute right-0 top-0 bg-white" :span="17">
      <MessageChatBox
        @emitRequest="onEmitRequest"
        v-if="displayChatBox"
        :letterLists="letterUserContents"
        :letterUser="letterContentUserInfo"
      />
      <MessageBackground v-else />
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";

import { getFollowUserMessage, getSendMsgUser } from "../../api/message";
import { FocusTheUser } from "./hook/factory";
import LRU from "../explore/LRUCache";
import followLetterInfo from "./hook/followLetterInfo";
import letterDexie from "./hook/letterDexie";

import MessageBackground from "./components/MessageBackground.vue";
import MessageChatBox from "./components/MessageChatBox.vue";
import MessageUser from "./components/MessageUser.vue";
import { ElRow, ElCol } from "element-plus";

import type { SendLetterInfoEmit } from "./type";

let preuid = null;
const dexie = new letterDexie();
const letterList = ref<FocusTheUser[]>([]);
const letterUserContents = ref<followLetterInfo[]>([]);
const letterContentUserInfo = ref<SendLetterInfoEmit>(null);

const beforePageTime = new Map<number, number[]>();

getSendMsgUser().then((senduser) => {
  letterList.value = senduser.data.msgs.map((follow) => new FocusTheUser(follow));
});

async function findFollowInfo(clickFollowInfo: SendLetterInfoEmit) {
  letterContentUserInfo.value = clickFollowInfo;

  try {
    //比较indexDB与lasttime是否相同
    const timeIsFit = await crcLastMsgTimeIsFit(clickFollowInfo.uid, clickFollowInfo.lastTime);

    if (timeIsFit) {
      const letterLists = await getLetterIndexDBInfo(clickFollowInfo.uid, clickFollowInfo.lastTime);
      setLetterContent(clickFollowInfo.uid, letterLists);
      return;
    }

    //请求数据
    const followMess = await getFollowUserMessage(clickFollowInfo.uid);
    const letterContent: followLetterInfo[] = followMess.data.msgs
      .map((mse) => new followLetterInfo(mse))
      .reverse();

    setBeforePageTime(clickFollowInfo.uid, letterContent);
    setLetterContent(clickFollowInfo.uid, letterContent);
    Promise.resolve().then(() => setLetterInfoToIndexDB(clickFollowInfo.uid, letterContent));
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
  await dexie.setLetterInfoLists(
    letterContent.map((value) => ({ uid, lasttime, letterinfo: value }))
  );
}

function diffDexieLetterInfos(lasttime: number, letterContent: followLetterInfo[]) {
  return dexie.diffPut(lasttime, letterContent);
}

function setLetterContent(uid: number, letterContent: followLetterInfo[]) {
  if (uid === preuid) {
    letterUserContents.value.push(...letterContent);
    preuid = uid;
  } else {
    letterUserContents.value = [];
    letterUserContents.value.push(...letterContent);
    preuid = uid;
  }
}

async function getLetterIndexDBInfo(uid: number, lasttime: number) {
  const letterLists = await dexie.getLetterInfos(uid, lasttime);

  return letterLists;
}

function dexieLetterInfos(uid) {}

async function crcLastMsgTimeIsFit(uid: number, lasttime: number) {
  const lasttimes = await dexie.getLastTimes(uid);

  if (lasttimes !== -1 && lasttimes && lasttimes.length > 0) {
    const fristTime = lasttimes[lasttimes.length - 1];
    fristTime === lasttime ? true : false;
  } else {
    return false;
  }
}

const displayChatBox = computed(() => {
  return letterUserContents.value.length > 0 && Object.keys(letterContentUserInfo.value).length > 0;
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
