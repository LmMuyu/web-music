<template>
  <ElContainer class="bg-white w-full">
    <ElAside width="350px">
      <MessageLeftUserData :letterList="letterList" @find-follow-mess="findFollowInfo" />
    </ElAside>
    <ElMain style="overflow: hidden; padding: 4px 0 0 0" class="ml-5 px-5 bg-white">
      <MessageChatBox
        @emitRequest="onEmitRequest"
        v-if="displayChatBox"
        :letterLists="letterUserContents"
        :letterUser="letterContentUserInfo"
      />
      <MessageBackground v-else />
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";

import { getFollowUserMessage, getSendMsgUser } from "../../api/message";
import { FocusTheUser } from "./hook/factory";
import followLetterInfo from "./hook/followLetterInfo";
import letterDexie from "./hook/letterDexie";

import MessageBackground from "./components/MessageBackground.vue";
import MessageChatBox from "./components/MessageChatBox.vue";
import MessageLeftUserData from "./components/MessageUser.vue";
import { ElContainer, ElMain, ElAside } from "element-plus";

import type { SendLetterInfoEmit } from "./type";
import { useStore } from "vuex";
import { onUnmounted } from "vue";

let preuid = null;
const store = useStore();
const dexie = new letterDexie();
const letterList = ref<FocusTheUser[]>([]);
const letterUserContents = ref<followLetterInfo[]>([]);
const letterContentUserInfo = ref<SendLetterInfoEmit>(null);

const beforePageTime = new Map<number, number[]>();

store.commit("setMainHidden", true);

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

onUnmounted(() => {
  store.commit("setMainHidden", false);
});
</script>
<style scoped lang="scss">
.container {
  &:deep(.main_padding) {
    padding-top: 1.5rem !important;
    padding-right: 0 !important;
    padding-bottom: 1.5rem !important;
    padding-left: 0 !important;
  }
}
</style>
