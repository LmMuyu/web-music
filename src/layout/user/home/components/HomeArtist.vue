<template>
  <card-row :playlist="artistlist" />
</template>
<script setup lang="ts">
import CardRow from "../../../../components/card/CardRow.vue";

defineProps({
  artistlist: {
    default: Array,
    required: true,
  },
});
</script>
<style scoped lang="scss"></style>
