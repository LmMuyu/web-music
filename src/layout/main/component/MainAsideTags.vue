<template>
  <section ref="asidetags" class="pl-14 h-full">
    <header style="height: 10%">44444</header>
    <main class="h-3/4">
      <MainTag />
    </main>
    <footer ref="footer" class="flex items-center" style="height: 15%">
      <MainAsideCard v-if="InfoCard.countRef" :infoData="InfoCard.userInfo" />
      <MainLoginButton class="flex justify-center outline" v-else />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";

import { useWatchLocal } from "../hooks/useWatchLocal";
import { BCBus } from "../hooks/useBroadcastChannel";

import MainLoginButton from "./MainLoginButton.vue";
import MainAsideCard from "./MainAsideCard.vue";
import MainTag from "./MainTag.vue";

const store = useStore();
const InfoCard = BCBus(); //接受登录后的用户信息

const asidetags = ref(null);
const footer = ref(null);

store.commit("login/onMittEvent", (value: any) => {
  console.log(value);

  InfoCard.userInfo = value?.value?.userInfo ?? nullUserInfo();
  InfoCard.negate();
});

useWatchLocal(); //侦听localstoreage

function nullUserInfo() {
  store.commit("maintags/clearModelComp");

  return {};
}

onMounted(() => {
  nextTick().then(() => {
    const btn = document.querySelector(".el-button") as HTMLElement;

    if (btn) {
      btn.style.outline = "none";
      btn.classList.add(...["justify-center", "w-1/2"]);
    } else if (!InfoCard.countRef) {
      console.error("ErrorType:'btn' for null");
    }
  });

  nextTick(() => {
    const mainheight = asidetags.value.clientHeight;
    const mainwidth = asidetags.value.clientWidth;

    const cardheight = footer.value.clientHeight;
    const cardwidth = footer.value.clientWidth;

    store.commit("maintags/setPosInfo", {
      x: mainwidth - cardwidth - 8,
      y: mainheight - cardheight,
      width: cardwidth + 16,
    });
  });
});
</script>
<style scoped lang="scss"></style>
