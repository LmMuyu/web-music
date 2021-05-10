<template>
  <el-container style="height: 100vh">
    <el-header class="h-1/5"></el-header>
    <el-main class="h-full"></el-main>
    <el-footer class="h-1/3 flex items-center">
      <div class="bg-blue-400 p-4 rounded-md w-full">
        <Audio :src="audiosrc" background="#ff7675" />
      </div>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

import { getMusicUrl, whetherMusic } from "../../api/playList/index";

import Audio from "/comps/player/Audio.vue";
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElMessage,
} from "element-plus";

const musicId = useRoute().query.id as string;
const audiosrc = ref("");

whetherMusic(musicId)
  .then(({ data }) => {
    const { success, message }: { success: boolean; message: string } = data;

    if (!success) {
      ElMessage.error({
        type: "error",
        message,
      });
    } else {
      return musicId;
    }
  })
  .then(async (id: string | undefined) => {
    if (!id) throw new Error("src" + ":" + "null");

    const { data } = await getMusicUrl(id);
    const src = data.data[0].url;

    if (!src) throw new Error("src" + ":" + "null");
    audiosrc.value = src;
  })
  .catch((err) => {
    console.log(err);
  });
</script>
<style scoped lang="scss"></style>
