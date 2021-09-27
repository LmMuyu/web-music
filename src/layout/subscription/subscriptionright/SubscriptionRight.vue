<template>
  <section>
    <header class="h-1/5">
      <SubscrionUserInfo />
    </header>
    <main>
      <SubscrionTopic />
    </main>
  </section>
</template>
<script setup lang="ts">
import { useStore } from "vuex";

import SubscrionUserInfo from "./components/SubscrionUserInfo.vue";
import SubscrionTopic from "./components/SubscrionTopic.vue";
</script>
<style scoped lang="scss"></style>
