<template>
  <Suspense>
    <template #default class="relative">
      <div class="h-full w-full"><slot></slot></div>
    </template>
    <template #fallback>
      <div class="flex justify-center items-center h-full w-full">
        <loading-icon />
      </div>
    </template>
  </Suspense>
</template>
<script setup lang="ts">
import LoadingIcon from "../svgloading/SvgLoading.vue";
</script>
<style scoped lang="scss"></style>
