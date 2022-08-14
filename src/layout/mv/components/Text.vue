<template>
  <div class="flex items-center">
    <span class="font-bold text-lg">{{ text }}</span>
    <FontIcon class="mx-1" size="20" icon="iconmore" />
  </div>
</template>

<script setup lang="ts">
import FontIcon from "../../../components/fonticon/FontIcon.vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
<style scoped lang="scss"></style>
