<template>
  <div class="flex items-center w-full py-3">
    <div class="flex items-center cursor-pointer w-5/6">
      <span class="whitespace-nowrap text-sm">{{ scopedData.name }}</span>
      <div class="flex items-center text-gray-300 truncate">
        <i class="text-xs">-</i>
        <p class="text-xs h-auto">{{ singerInfo }}</p>
      </div>
    </div>
    <div class="h-full w-full cursor-pointer flex justify-center">
      <svg class="icon_remove" width="12" height="12" style="stroke: #636e72; stroke-width: 1">
        <line x1="0" y1="0" x2="12" y2="12"></line>
        <line x1="12" y1="0" x2="0" y2="12"></line>
      </svg>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps } from "@vue/runtime-core";

const props = defineProps({
  scopedData: {
    type: Object,
    default: () => ({}),
  },
});

const singerInfo = computed(() => {
  return (props.scopedData.singerInfo as any[]).map((v) => v.name).join("/");
});
</script>
<style scoped lang="scss">
.icon_remove {
  margin: 0 auto;
}
</style>
