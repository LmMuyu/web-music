<template>
  <section>
    <span>
      <p>热门话题</p>
    </span>
    <nav ref="nav" class="py-4">
      <SubscrionItem :renderList="renderTopic" />
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
