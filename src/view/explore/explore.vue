<template>
  <mainContent></mainContent>
</template>
<script setup lang="ts">
import { runLoadView } from "../../components/maincontent/hooks/component";
import mainContent from "../../components/maincontent/mainContent.vue";

runLoadView(["ExploreContent", "ExploreRight"]);
</script>
<style scoped lang="scss"></style>
