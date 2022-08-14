<template>
  <ElContainer class="py-4">
    <ElHeader>
      <Text text="官方出品"></Text>
    </ElHeader>
    <Lists :rootlist="exclusivelist"></Lists>
  </ElContainer>
</template>
<script setup lang="ts">
import { ElContainer, ElHeader } from "element-plus";
import { ref } from "vue";
import { exclusiveMv } from "../../../api/mv";

import Lists from "./Lists.vue";
import Text from "./Text.vue";

const exclusivelist = ref([]);

exclusiveMv().then((exclusive) => {
  exclusivelist.value = exclusive.data.data;
});
</script>
<style scoped lang="scss"></style>
