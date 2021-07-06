<template>
  <header style="height: 10%">44444</header>
  <main class="h-3/4">
    <nav>
      <IndexTag />
    </nav>
  </main>
  <footer class="flex items-center" style="height: 15%">
    <IndexAsideCard v-if="asideCard" :infoData="userInfo" />
    <IndexLoginButton
      class="flex justify-center outline"
      v-else
      @click="loginApp('#login')"
    />
  </footer>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";

import IndexLoginButton from "./IndexLoginButton.vue";
import IndexAsideCard from "./IndexAsideCard.vue";
import IndexTag from "./IndexTag.vue";

import loginApp from "../../../view/login/login";
import { useRefNegate } from "../../../utils/useRefNegate";
import { nextTick, onMounted } from "@vue/runtime-core";

const store = useStore();

const userInfo = ref({});

const { countRef: asideCard, negate } = useRefNegate(true);

function touchInfo(info: any) {
  userInfo.value = info;
  negate();
}

const stepWatch = store.watch(
  () => store.state.userInfo,
  (info) => (info ? touchInfo(info) : negate()),
  { immediate: true }
);

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
