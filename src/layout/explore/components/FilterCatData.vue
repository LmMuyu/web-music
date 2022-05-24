<template>
  <better-scroll :open-h-render="false" :item-len="Infinity">
    <el-container>
      <el-main>
        <card-row topath="/songdetail" :playlist="catPlaylists"></card-row>
      </el-main>
    </el-container>
  </better-scroll>
</template>
<script setup lang="ts">
import { ElContainer, ElMain } from "element-plus";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import CardRow from "../../../components/card/CardRow.vue";

const props = defineProps({
  catPlaylists: {
    type: Array,
    default: () => [],
  },
});
</script>
<style scoped lang="scss"></style>
