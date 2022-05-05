<template>
  <section>
    <div v-if="newMsgCount > 0" class="flex justify-between items-center pb-4">
      <p>新信息</p>
      <p>
        <router-link to="/message"> 更多</router-link>
      </p>
    </div>
    <div>
      <SubscrionItem :renderlists="msgList" to-path="/message" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

// import { getPrivateLetter } from "../../../../api/message";

import SubscrionItem from "./SubscrionItem.vue";

import type { Method } from "axios";

const newMsgCount = ref(0);
const msgList = ref([]);

let timer = null;

function getMsg(method: Method = "GET") {
  // getPrivateLetter(method, 5).then((privatemeg) => {
  //   msgList.value = privatemeg.data["msgs"].map((v) => {
  //     return {
  //       sharePicUrl: v.fromUser.avatarUrl,
  //       nickname: v.fromUser.nickname,
  //       msg: JSON.parse(v.lastMsg).msg,
  //     };
  //   });
  //   newMsgCount.value = privatemeg.data.newMsgCount;
  // });
  // timer = setInterval(() => {
  //   getMsg("HEAD");
  // }, 1000 * 10);
}

getMsg();

onBeforeUnmount(() => {
  clearInterval(timer);
  timer = null;
});
</script>
<style scoped lang="scss"></style>
