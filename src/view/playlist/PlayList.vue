<template>
  <el-container style="height: 100vh">
    <el-main class="h-full">
      <PlayLsitMain></PlayLsitMain>
    </el-main>
    <el-footer class="flex items-center relative">
      <div class="bg-blue-400 rounded-md w-full">
        <Audio
          :src="audiosrc"
          :musicName="singer"
          :musicImage="musicInfo.picUrl"
          background="#ff7675"
          @currPlayTime="currPlayTime"
        ></Audio>
      </div>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { getMusicUrl, whetherMusic } from "../../api/playList/index";
import { musicItemList } from './hooks/data'

import Audio from "/comps/player/Audio.vue";
import PlayLsitMain from "./components/PlayLsitMain.vue";
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElMessage,
} from "element-plus";

import type { MatchItem } from './type'

const store = useStore();

const musicId = useRoute().query.id as string;
const musicInfo = store.state.musicInfo;
const audiosrc = ref("");

const singer = computed(
  () => `${musicInfo.singerInfo.name} - ${musicInfo.name}`
);

let infoobj: MatchItem | null = null

function currPlayTime(time: string) {
  const playTime = parseInt(time)

  // const musicItem = musicItemList.value.get(playTime)!

  // if (!infoobj) infoobj = musicItem

  // if (infoobj !== musicItem) {
  //   infoobj.node?.classList.remove("bg-blue-400")
  //   infoobj = null
  // }

  // musicItem?.node?.classList.add("bg-blue-400")
}

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
