<template>
  <Suspense>
    <template #default class="relative">
      <div class="h-full w-full"><slot></slot></div>
    </template>
    <template #fallback>
      <div class="flex justify-center items-center h-full">
        <div>Loading....</div>
      </div>
    </template>
  </Suspense>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss"></style>
