<template>
  <ElContainer class="py-4">
    <ElHeader>
      <Text text="热播MV"></Text>
    </ElHeader>
    <Lists :rootlist="hotlist"></Lists>
  </ElContainer>
</template>
<script setup lang="ts">
import { ElContainer, ElHeader } from "element-plus";
import { ref } from "vue";
import { hotMv } from "../../../api/mv";

import Lists from "./Lists.vue";
import Text from "./Text.vue";

const hotlist = ref([]);

hotMv().then((hot) => {
  hotlist.value = hot.data.data;
});
</script>
<style scoped lang="scss"></style>
