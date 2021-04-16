<template>
  <OtherLoginArticle @onOther="other" />
  <OtherLoginFooter @onOther="other" />
</template>
<script setup lang="ts">
import { defineEmit } from "@vue/runtime-dom";
import OtherLoginArticle from "./components/OtherLoginArticle.vue";
import OtherLoginFooter from "./components/OtherLoginFooter.vue";

const ctxEmit = defineEmit(["onOther"]);

function other() {
  ctxEmit("onOther");
}
</script>
<style lang="scss" scoped></style>
