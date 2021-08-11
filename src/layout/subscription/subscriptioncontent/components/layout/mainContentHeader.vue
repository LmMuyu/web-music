<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <p>{{ userinfo.nickname }}</p>
      <p class="text-sm mx-2" style="color: #b2bec3">{{ eventType(type) }}</p>
    </div>
    <div>
      <p>2021-4-5</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";

import { eventType } from "../../hooks/eventType";

const props = defineProps({
  userinfo: {
    type: Object,
    default: () => {},
  },
  type: {
    type: Number,
    required: true,
  },
});
</script>
<style scoped lang="scss"></style>
