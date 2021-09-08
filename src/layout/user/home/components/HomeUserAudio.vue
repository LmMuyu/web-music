<template>
  <p></p>
  <el-container>
    <el-main class="flex flex-col">
      <el-row v-for="(djaudio, index) in audioRadios" :key="index">
        <el-col :span="3">
          <ElImage :src="djaudio.picUrl" />
        </el-col>
        <el-col :span="13">
          <p>{{ djaudio.name }}</p>
        </el-col>
        <el-col :span="5">
          <p>{{ djaudio.subCount }}</p>
        </el-col>
        <el-col :span="3">
          <p>{{ djaudio.programCount }}期</p>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "@vue/runtime-core";

import { getUserAudio } from "../../../../api/user";

import { ElContainer, ElMain, ElRow, ElCol, ElImage } from "element-plus";

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({}),
  },
});

const audioRadios = ref([]);

const watchStop = watchEffect(async () => {
  const djRadios = await getUserAudio(props.profile.userId);

  audioRadios.value = djRadios.data.djRadios;

  console.log(djRadios);
});

watchStop();
</script>
<style scoped lang="scss"></style>
