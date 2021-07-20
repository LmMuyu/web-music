<template>
  <WriterBox :default-value="value" />
</template>
<script setup lang="ts">
import { defineEmit } from "@vue/runtime-core";

import WriterBox from "./MessageWriterBox.vue";

const ctxEmit = defineEmit(["portmsg"]);

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
});
</script>
<style scoped lang="scss"></style>
