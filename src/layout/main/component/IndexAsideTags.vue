<template>
  <header style="height: 10%">44444</header>
  <main class="h-3/4">
    <nav>
      <IndexTag />
    </nav>
  </main>
  <footer class="flex items-center" style="height: 15%">
    <IndexAsideCard v-if="asideCard" :infoData="userInfo" />
    <IndexLoginButton v-else />
  </footer>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";

import IndexLoginButton from "./IndexLoginButton.vue";
import IndexAsideCard from "./IndexAsideCard.vue";
import IndexTag from "./IndexTag.vue";

const store = useStore();

const userInfo = ref({});
const asideCard = ref(true);

store.state.userInfo
  ? (userInfo.value = store.state.userInfo)
  : (asideCard.value = false);
</script>
<style scoped lang="scss"></style>
