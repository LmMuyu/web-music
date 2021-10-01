<template>
  <section>
    <header class="h-1/5">
      <SubscrionUserInfo />
    </header>
    <main class="h-full p-4">
      <SubscrionNewMeg />
      <SubscrionTopic />
    </main>
  </section>
</template>
<script setup lang="ts">
import SubscrionUserInfo from "./components/SubscrionUserInfo.vue";
import SubscrionNewMeg from "./components/SubscrionNewMeg.vue";
import SubscrionTopic from "./components/SubscrionTopic.vue";
</script>
<style scoped lang="scss"></style>
