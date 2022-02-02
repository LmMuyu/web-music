<template>
  <el-row class="flex w-full">
    <el-col :span="12">
      <IndexNavTag @loadComps="loadComps" />
    </el-col>
    <el-col :span="6"></el-col>
    <el-col :span="6">
      <IndexSearch />
    </el-col>
  </el-row>
</template>
<script setup lang='ts'>
import { useRouter } from 'vue-router';

import IndexSearch from "../../../components/search/Search.vue";
import IndexNavTag from '../navTag/NavTag.vue';
import { ElRow, ElCol } from "element-plus"

const router = useRouter();

function loadComps(comp: string[]) {
  const compname = comp[0];

  if (router.hasRoute(compname) || router.hasRoute(compname.toLowerCase())) {
    router.push({
      name: compname,
    });
  } else {
    //导航到404
  }
}
</script>
<style scoped lang='scss'>
</style>