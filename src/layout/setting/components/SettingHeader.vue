<template>
  <el-row class="w-1/3" align="middle">
    <el-col
      @click="clickSettingTag(sett)"
      :class="
        defaultSett === sett.tag
          ? 'text-lg font-bold'
          : 'text-sm cursor-pointer'
      "
      :span="colSpan(settingTags)"
      v-for="(sett, index) in setting"
      :key="index"
    >
      {{ sett.tag }}
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { setting } from "../hooks";

import { ElRow, ElCol } from "element-plus";

const ctxEmit = defineEmits(["cursetting"]);

const defaultSett = ref(setting[0].tag);
const settingTags = setting.map((v) => v.tag);

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

function clickSettingTag(settingTag: typeof setting[0]) {
  defaultSett.value = settingTag.tag;
  ctxEmit("cursetting", settingTag.node);
}
</script>
<style scoped lang="scss"></style>
