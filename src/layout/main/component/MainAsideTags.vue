<template>
  <header style="height: 10%">44444</header>
  <main class="h-3/4"><MainTag /></main>
  <footer class="flex items-center" style="height: 15%">
    <MainAsideCard v-if="InfoCard.countRef" :infoData="InfoCard.userInfo" />
    <MainLoginButton
      class="flex justify-center outline"
      v-else
      @click="loginApp('#login')"
    />
  </footer>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive } from "@vue/runtime-core";
import { useStore } from "vuex";

import { useRefNegate } from "../../../utils/useRefNegate";
import { BCBus } from "../hooks/useBroadcastChannel";
import loginApp from "../../../view/login/login";

import MainLoginButton from "./MainLoginButton.vue";
import MainAsideCard from "./MainAsideCard.vue";
import MainTag from "./MainTag.vue";

const store = useStore();

const { countRef, negate } = useRefNegate(false);

const InfoCard = reactive({
  userInfo: {},
  countRef,
  negate,
});

BCBus(InfoCard); //接受登录后的用户信息

store.watch(
  () => store.state.userInfo,
  (value) => {
    if (!value) return;
    InfoCard.userInfo = value.userinfoData;
    negate();
  },
  { immediate: true }
);

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
<style scoped lang="scss"></style>
