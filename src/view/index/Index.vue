<template>
  <MainContent>
    <nav class="w-full h-full">
      <IndexNavTag @loadComps="runLoadView" />
    </nav>
  </MainContent>
</template>
<script setup lang="ts">
import { runLoadView } from "../../components/maincontent/hooks/component";

import MainContent from "../../components/maincontent/MainContainer.vue"
import IndexNavTag from "../../layout/Index/navTag/navTag.vue";
</script>
<style scoped lang="scss">
</style>
