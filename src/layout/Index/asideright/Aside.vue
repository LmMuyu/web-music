<template>
  <div>
    <AsideUserProfile />
    <div class="mt-4"></div>
    <AsideSinger />
    <div class="mt-4"></div>
    <AsidePopularAnchors />
  </div>
</template>
<script setup lang="ts">
import AsidePopularAnchors from "./components/AsidePopularAnchors.vue";
import AsideUserProfile from "./components/AsideUserProfile.vue";
import AsideSinger from "./components/AsideSinger.vue";
</script>
<style lang="scss" scoped></style>
