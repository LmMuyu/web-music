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
          :musicImage="musicInfo?.picUrl"
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

import { getMusicDetail, getMusicUrl, whetherMusic } from "../../api/playList/index";
// import { musicItemList } from './hooks/data'
import { musicDetail } from '../../utils/musicDetail'

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
import type { Singer as vocalist } from '../../utils/musicDetail'


interface MusicInfo {
  id: number;
  name: string;
  picUrl: string;
  singerInfo: vocalist;
}

const musicId = useRoute().query.id as string;
const musicInfo = ref<MusicInfo | null>(null);
const audiosrc = ref("");

const singer = computed(
  () => musicInfo.value && `${musicInfo.value.singerInfo.name} - ${musicInfo.value?.name} `
);



// let infoobj: MatchItem | null = null

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


getMusicDetail(musicId).then(({ data }) => {
  const songs = data.songs
  Promise.resolve(songs).then((res) => new musicDetail(res))

  return songs.id
}).then(async (musicIds: string) => {
  const { data } = await whetherMusic(musicIds)

  const { success, message }: {
    success: boolean; message: string
  } = data;

  return !success ? (ElMessage.error({ type: "error", message }) && musicIds) : musicIds
}).then(async (id: string | undefined) => {
  if (!id) throw new Error("src" + ":" + "null");

  const { data } = await getMusicUrl(id);
  const src = data.data[0].url;

  if (!src) throw new Error("src" + ":" + "null");
  audiosrc.value = src;
}).catch(() => {

})
</script>
<style scoped lang="scss"></style>
