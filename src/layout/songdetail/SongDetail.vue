<template>
  <el-container class="relative w-full h-full overflow-y-scroll song_container">
    <el-main class="absolute left-0 top-0 right-0">
      <SongBasicDetail :playlist="playlistDetail" />
      <SongCollection :playlist-tracks="detailLists" />
      <div v-if="loadGengdDuo" class="w-full flex justify-center">
        <ElButton> 加载更多 </ElButton>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { songDetail } from "../../api/songdetail";
import { musicResultDetail } from "../../utils/musicDetail";
import transformSongDetails from "./utils/transformSongDetails";

import { ElButton, ElContainer, ElMain } from "element-plus";
import SongBasicDetail from "./components/SongBasicDetail.vue";
import SongCollection from "./components/SongCollection.vue";


const route = useRoute();
const store = useStore();

const detailLists = ref([]);
const playlistDetail = ref({});

songDetail(route.query.id as unknown as number).then((detaillist) => {
  detailLists.value = detaillist.data.playlist.tracks.map((detail) => musicResultDetail(detail));
  playlistDetail.value = transformSongDetails(detaillist.data.playlist);
});

const loadGengdDuo = computed(() => {
  const islogin = store.getters["login/getIslogin"];
  return !islogin;
});
</script>
<style scoped lang="scss">
.song_container {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
