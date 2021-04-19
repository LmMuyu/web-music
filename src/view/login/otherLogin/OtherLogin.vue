<template>
  <OtherLoginArticle @onOther="onOther" />
  <OtherLoginFooter @onOther="onOther" />
</template>
<script setup lang="ts">
import { defineEmit } from "@vue/runtime-dom";
import OtherLoginArticle from "./components/OtherLoginArticle.vue";
import OtherLoginFooter from "./components/OtherLoginFooter.vue";

const ctxEmit = defineEmit(["onOther"]);

function onOther(comp: string) {
  ctxEmit("onOther", comp);
}
</script>
<style lang="scss" scoped></style>
