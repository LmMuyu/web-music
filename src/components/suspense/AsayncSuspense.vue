<template>
  <Suspense>
    <template #default>
      <div><slot></slot></div>
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
