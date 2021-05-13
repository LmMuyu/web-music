<template>
  <IndexTag />

  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup lang="ts">
import IndexTag from "./component/IndexTag.vue";
import Login from "../../view/login/Login.vue";
</script>

<style scoped lang="scss"></style>
