<template>
  <section class="flex">
    <div style="width: 10%">
      <el-avatar></el-avatar>
    </div>
    <div style="width: 90%">
      <contentShow :userInfo="userInfo" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { useStore } from "vuex";

import { ElAvatar } from "element-plus";
import contentShow from "./contentShow.vue";

import type { State } from "../../../../store/type";

const store = useStore();
const state = store.state as State;

const userInfo = state.userInfo;
</script>
<style scoped lang="scss"></style>
