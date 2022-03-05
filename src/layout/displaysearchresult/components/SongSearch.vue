<template></template>
<script setup lang="ts">
import { onMounted } from "vue";

const props = defineProps({
  data: {
    type: Array,
  },
});

onMounted(() => {
  console.log(props);
});
</script>
<style scoped lang="scss"></style>
