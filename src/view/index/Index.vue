<template>
  <IndexTag />
  
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup>
import IndexTag from "./component/IndexTag.vue";
import Login from "../../view/login/Login.vue";
</script>

<style scoped lang="scss"></style>
