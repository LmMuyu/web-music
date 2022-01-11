<template>
  <el-container>
    <el-main>
      <card-row :playlist="catPlaylists"></card-row>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ElContainer, ElMain } from "element-plus";
import CardRow from "../../../components/card/CardRow.vue";

const props = defineProps({
  catPlaylists: {
    type: Array,
    default: () => [],
  },
});
</script>
<style scoped lang="scss"></style>
