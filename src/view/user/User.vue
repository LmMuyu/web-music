<template>
  <router-view v-slot="{ Component }">
    <component :is="Component"></component>
  </router-view>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss"></style>
