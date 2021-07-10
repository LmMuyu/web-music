<template>
  <mainContent>
    <nav class="w-full h-full">
      <navTag @loadComps="runLoadView" />
    </nav>
  </mainContent>
</template>
<script setup lang="ts">
import { runLoadView } from "../../components/maincontent/hooks/component";

import navTag from "../../layout/Index/navTag/navTag.vue";
import mainContent from "../../components/maincontent/mainContent.vue";
</script>
<style scoped lang="scss"></style>
