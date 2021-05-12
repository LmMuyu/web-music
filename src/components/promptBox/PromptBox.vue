<template>
  <div
    class="
      w-36
      h-9
      flex
      justify-center
      items-center
      absolute
      top-1/2
      left-1/2
      transform
      -translate-x-1/2 -translate-y-1/2
      rounded-md
      text-white
      background
    "
  >
    {{ title }}
  </div>
</template>
<script setup lang="ts">
import { defineProps, getCurrentInstance } from "@vue/runtime-core";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
<style scoped lang="scss">
.background {
  background: rgb(45, 52, 54, 0.8);
}
</style>
