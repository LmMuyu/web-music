<template>
  <Suspense>
    <template #default>
      <div><slot></slot></div>
    </template>
    <template #fallback>
      <div>Loading....</div>
    </template>
  </Suspense>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss"></style>
