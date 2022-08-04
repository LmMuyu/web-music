<template>
  <div class="flex justify-center items-center px-4">
    <span class="p-1 text-xs">{{ playerTime[0] }}</span>
    <span class="p-1 text-xs">:</span>
    <span class="p-1 text-xs">{{ playerTime[1] }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import filterDate from "../../../utils/filterDate";

type minute = string;
type second = string;

const props = defineProps({
  time: {
    type: Number,
    depfault: 0,
  },
});

const playerTime = ref<[minute, second]>(["0", "0"]);

watchEffect(() => {
  const [min, sec] = filterDate(props.time).split(":") as [minute, second];
  playerTime.value = [min, sec];
});
</script>
<style scoped lang="scss"></style>
