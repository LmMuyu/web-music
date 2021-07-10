<template>
  <span v-if="state"> 登录 </span>
  <Loading v-else :width="31.4" :height="31.4" />
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";

import Loading from "../../../../../components/loading/Loading.vue";

const props = defineProps({
  state: {
    type: Boolean,
    required: true,
  },
});
</script>
<style scoped lang="scss"></style>
