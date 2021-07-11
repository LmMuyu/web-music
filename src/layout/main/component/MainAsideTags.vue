<template>
  <header style="height: 10%">44444</header>
  <main class="h-3/4">
    <nav>
      <MainTag />
    </nav>
  </main>
  <footer class="flex items-center" style="height: 15%">
    <MainAsideCard v-if="InfoCard.asideCard" :infoData="InfoCard.userInfo" />
    <MainLoginButton
      class="flex justify-center outline"
      v-else
      @click="loginApp('#login')"
    />
  </footer>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive } from "@vue/runtime-core";

import { useRefNegate } from "../../../utils/useRefNegate";
import { BCBus } from "../hooks/useBroadcastChannel";
import loginApp from "../../../view/login/login";

import MainLoginButton from "./MainLoginButton.vue";
import MainAsideCard from "./MainAsideCard.vue";
import MainTag from "./MainTag.vue";

const { countRef: asideCard, negate } = useRefNegate(false);

const InfoCard = reactive({
  userInfo: {},
  asideCard,
  negate,
});

BCBus(InfoCard); //接受登录后的用户信息

onMounted(() => {
  nextTick().then(() => {
    const btn = document.querySelector(".el-button");
    //@ts-ignore
    btn.style.outline = "none";
    btn?.classList.add(...["justify-center", "w-1/2"]);
  });
});
</script>
<style scoped lang="scss"></style>
