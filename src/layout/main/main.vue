<template>
  <div class="h-full">
    <div class="float-left w-1/5 h-full">
      <div class="pl-14 h-full">
        <IndexAsideTags />
      </div>
    </div>
    <div class="overflow-hidden w-4/5 h-full bg-red-900">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import IndexAsideTags from "./component/IndexAsideTags.vue";
</script>

<style scoped lang="scss"></style>
