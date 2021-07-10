<template>
  <OtherLoginArticle @onOther="onOther" />
  <OtherLoginFooter @onOther="onOther" />
</template>
<script setup lang="ts">
import { defineEmit, provide, ref } from "@vue/runtime-dom";
import OtherLoginArticle from "./components/OtherLoginArticle.vue";
import OtherLoginFooter from "./components/OtherLoginFooter.vue";

const ctxEmit = defineEmit(["onOther"]);
const protocol = ref(false); //是否同意条款
provide("protocol", protocol);

function onOther(comp: string) {
  ctxEmit("onOther", comp);
}
</script>
<style lang="scss" scoped></style>
