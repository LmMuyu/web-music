<template>
  <div class="flex justify-center items-center px-4">
    <span class="p-1 text-xs">{{ minute }}</span>
    <span class="p-1 text-xs">:</span>
    <span class="p-1 text-xs">{{ second }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import filterDate from "../../../utils/filterDate";

const props = defineProps({
  time: {
    type: Number,
    default: 0,
  },
});

const minute = ref([]);
const second = ref([]);

watchEffect(() => {
  const deta = filterDate(props.time).split(":");
  minute.value = deta[0];
  second.value = deta[1];
});
</script>
<style scoped lang="scss"></style>
