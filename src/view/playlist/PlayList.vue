<template>
  <el-container style="height: 100vh">
    <el-header class="h-1/5"></el-header>
    <el-main class="h-full"></el-main>
    <el-footer class="h-1/5">
      <div class="bg-blue-400">
        <Audio :src="audiosrc" />
      </div>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

import { getMusicUrl } from "../../api/playList/index";

import Audio from "/comps/player/Audio.vue";
import { ElContainer, ElHeader, ElMain, ElFooter } from "element-plus";

const musicId = useRoute().query.id as string;
const audiosrc = ref("");

getMusicUrl(musicId)
  .then(({ data }) => data.data[0].url)
  .then(
    (src) =>
      new Promise((resolve, reject) => {
        if (!src) {
          reject("src" + ":" + "null");
        }

        console.log(src);

        audiosrc.value = src;
      })
  )
  .catch((err) => {
    console.log(err);
  });
</script>
<style scoped lang="scss"></style>
