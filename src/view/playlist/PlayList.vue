<template>
  <el-container style="height: 100vh">
    <el-header></el-header>
    <el-main class="h-full"></el-main>
    <el-footer class="flex items-center">
      <div class="bg-blue-400 rounded-md w-full">
        <Audio
          :src="audiosrc"
          :musicName="singer"
          :musicImage="musicInfo.picUrl"
          background="#ff7675"
        />
      </div>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { getMusicUrl, whetherMusic } from "../../api/playList/index";

import Audio from "/comps/player/Audio.vue";
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElMessage,
} from "element-plus";

const store = useStore();

const musicId = useRoute().query.id as string;
const audiosrc = ref("");
const musicInfo = store.state.musicInfo;
console.log(musicInfo.picUrl);

const singer = computed(
  () => `${musicInfo.singerInfo.name} - ${musicInfo.name}`
);

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
