<template>
  <div class="py-4">
    <span class="text-2xl" style="color: #7474ad">{{title}}</span>
  </div>
</template>
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
<style scoped lang="scss"></style>
