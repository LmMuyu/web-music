<template>
  <el-container>
    <el-header>
      <NavTag @loadComps="loadComps" />
    </el-header>
    <el-main> <router-view></router-view> </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { ElContainer, ElHeader, ElMain } from "element-plus";
import NavTag from "../navTag/NavTag.vue";
import { useRouter } from "vue-router";

const componentId = ref();

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
<style scoped lang="scss"></style>
