<template>
  <HeadTitle title="推荐歌单" />
  <ElRow>
    <ElCol :span="12">
      <div
        v-for="(hotsong, index) in recommendSongs.slice(0, 1)"
        class="flex flex-col relative w-80 rounded-md"
        :key="index"
        :span="14"
      >
        <PlayList :hotsong="hotsong" />
      </div>
    </ElCol>
    <ElCol :span="12" class="container">
      <div
        v-for="(hotsong, index) in recommendSongs.slice(1)"
        class="flex flex-col relative w-32 h-32 rounded-md"
        :key="index"
      >
        <PlayList :hotsong="hotsong" />
      </div>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { RecPlayList } from "..";
import { getRecommend } from "../../../api/index";

import HeadTitle from "./IndexModuleHeadTitle.vue";
import { ElRow, ElCol } from "element-plus";
import PlayList from "./PlayList.vue";

const recommendSongs = ref<RecPlayList[]>([]);

getRecommend(5).then((res) => {
  recommendSongs.value = res.data.result.map((res) => new RecPlayList(res));
});
</script>
<style scoped lang="scss">
.container {
  display: grid;
  grid-auto-flow: row dense;
  grid-auto-columns: 1fr;
  grid-template-columns: 0.8fr 0.8fr;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 40px;
  grid-template-areas:
    ". ."
    ". .";
}
</style>
