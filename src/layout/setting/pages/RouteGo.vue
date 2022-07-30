<template>
  <FontIcon
    @click="router.go(-1)"
    size="24"
    class="cursor-pointer flex items-center"
    icon="iconarrow-right-copy"
  />
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

import FontIcon from "../../../components/fonticon/FontIcon.vue";

const router = useRouter();
</script>
<style scoped lang="scss"></style>
