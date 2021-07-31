<template>
  <p v-html="toParseJson"></p>
</template>
<script setup lang="ts">
import { computed } from "@vue/runtime-core";

const props = defineProps({
  eventJson: {
    type: Object,
    default: () => ({}),
  },
});

const toParseJson = computed(() => {
  const renderStr: string = props.eventJson["msg"];

  return renderStr.replace(/\n/g, "<br/>");
});
</script>
<style scoped lang="scss"></style>
