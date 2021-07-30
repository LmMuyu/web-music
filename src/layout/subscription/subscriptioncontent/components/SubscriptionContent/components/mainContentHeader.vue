<template>
  <div>
    <div>
      <p>{{ userinfo.nickname }}</p>
      <p>111111</p>
    </div>
    <div></div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  userinfo: {
    type: Object,
    default: () => {},
  },
});
</script>
<style scoped lang="scss"></style>
