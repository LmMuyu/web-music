<template>
  <MainContent></MainContent>
</template>
<script setup lang="ts">
import { runLoadView } from "../../components/maincontent/hooks/component";
import MainContent from "../../components/maincontent/MainContainer.vue";

runLoadView(["ExploreContent", "ExploreRight"]);
</script>
<style scoped lang="scss"></style>
