<template>
  <header style="height: 10%">44444</header>
  <main class="h-3/4">
    <MainTag />
  </main>
  <footer class="flex items-center relative" style="height: 15%">
    <MainAsideCard v-if="InfoCard.countRef" :infoData="InfoCard.userInfo" />
    <MainLoginButton class="flex justify-center outline" v-else />
  </footer>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive } from "@vue/runtime-core";
import { useStore } from "vuex";

import { useRefNegate } from "../../../utils/useRefNegate";
import { BCBus } from "../hooks/useBroadcastChannel";

import MainLoginButton from "./MainLoginButton.vue";
import MainAsideCard from "./MainAsideCard.vue";
import MainTag from "./MainTag.vue";
import { useWatchLocal } from "../hooks/useWatchLocal";

const store = useStore();

const { countRef, negate } = useRefNegate(false);

const InfoCard = BCBus(countRef, negate); //接受登录后的用户信息

store.watch(
  () => store.state.userInfo,
  (value) => {
    if (!value) {
      if (store.getters.getStatus === 200) {
        InfoCard.userInfo = {}
        store.commit("setLoginStatus", 301)

        negate()
      }

      return
    };


    InfoCard.userInfo = value.userInfo;
    negate();
  },
  { immediate: true }
);

useWatchLocal() //侦听localstoreage

onMounted(() => {
  nextTick().then(() => {
    const btn = document.querySelector(".el-button") as HTMLElement;

    if (btn) {
      btn.style.outline = "none";
      btn.classList.add(...["justify-center", "w-1/2"]);
    } else if (!countRef.value) {
      console.error("ErrorType:'btn' for null");
    }
  });
});
</script>
<style scoped lang="scss">
</style>
