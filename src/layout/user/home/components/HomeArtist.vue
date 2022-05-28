<template>
  <card-row :topath="path" :playlist="artistlist" />
</template>
<script setup lang="ts">
import CardRow from "../../../../components/card/CardRow.vue";

defineProps({
  artistlist: {
    default: Array,
    required: true,
  },
  path: String,
});
</script>
<style scoped lang="scss"></style>
