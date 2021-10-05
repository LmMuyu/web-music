<template>
  <div v-if="chatContentBox">
    <MessageChatBox :privateLetter="privateLetter" />
  </div>
  <!-- <MessageBackground v-else /> -->
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, watch } from "vue-demi";
import { useStore } from "vuex";
import { ref } from "vue";

import MessageChatBox from "../components/MessageChatBox.vue";
// import MessageBackground from "../components/MessageBackground.vue";

import type { LocationQuery } from "vue-router";
import type { PRIVATEPROPLEL_AND_ETTER } from "../type";

const route = useRoute();
const store = useStore();

const chatContentBox = ref(false);
const letterList = computed(() => store.getters["message/retLetterList"]);
const privateLetter = ref<PRIVATEPROPLEL_AND_ETTER>({
  propleInfo: null,
  totals: null,
});

function findLetterContent(query: LocationQuery) {
  if (typeof query.curindex === "string" && typeof query.uid === "string") {
    const msgContent = letterList.value[query.curindex];

    const propleInfo = {
      avatarUrl: msgContent.fromUser.avatarUrl,
      uid: msgContent.fromUser.userId,
      nickname: msgContent.fromUser.nickname,
    };

    privateLetter.value.propleInfo = propleInfo;

    if (msgContent && propleInfo.uid == query.uid) {
      privateLetter.value.totals = msgContent.totals;
    } else {
      const list = letterList.value.find(
        (letter) => propleInfo.uid == query.uid
      );
      privateLetter.value.totals = list.totals;
    }
  }
}

watch(
  () => route.query,
  (query) => {
    findLetterContent(query);
    chatContentBox.value = true;
  }
);
</script>
<style scoped lang="scss"></style>
