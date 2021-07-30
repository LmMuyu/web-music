<template>
  <section>
    <header>
      <mainContentHeader :userinfo="event.user" />
    </header>
    <main class="py-6">
      <div v-html="toParseJson"></div>
    </main>
    <footer>
      <mainContentFooter :likedCount="event.info.likedCount" />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { computed } from "@vue/runtime-core";

import mainContentHeader from "./mainContentHeader.vue";
import mainContentFooter from "./mainContentFooter.vue";

const props = defineProps({
  event: {
    type: Object,
    default: () => {},
  },
});

const toParseJson = computed(() => {
  return JSON.parse(props.event.json)["msg"];
});
</script>
<style scoped lang="scss"></style>
