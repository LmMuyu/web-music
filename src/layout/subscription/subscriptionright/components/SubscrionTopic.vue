<template>
  <section>
    <span> 热门话题 </span>
    <nav ref="nav" class="py-4">
      <subscrion-item :renderlists="renderTopic" :to-path="'/topic'" />
    </nav>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { getTopic } from "../../../../api/subscription";

import SubscrionItem from "./SubscrionItem.vue";

const nav = ref<HTMLElement | null>(null);

const renderTopic = ref([]);

getTopic().then((topic) => {
  renderTopic.value.push(...topic.data.hot);
});
</script>
<style scoped lang="scss"></style>
