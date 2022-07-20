<template>
  <el-row class="w-1/3" align="middle">
    <el-col
      :class="defaultSett === sett ? 'text-lg font-bold' : 'text-sm cursor-pointer'"
      :span="colSpan(setting)"
      @click="defaultSett = sett"
      v-for="(sett, index) in setting"
      :key="index"
    >
      {{ sett }}
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { setting } from "../hooks";

import { ElRow, ElCol } from "element-plus";

const defaultSett = ref(setting[0]);

function colSpan(setting: string[]) {
  const len = setting.length;
  const SPAN_MAX = 24;

  for (let i = 1; i <= len; i++) {
    const ls = len * i;
    if (ls === SPAN_MAX) return i;

    if (len * i > SPAN_MAX) {
      return i - 1;
    }
  }
}
</script>
<style scoped lang="scss"></style>
