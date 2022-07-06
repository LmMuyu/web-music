<template>
  <el-container class="relative w-full h-full overflow-y-scroll bg-white song_container">
    <el-main class="absolute left-0 top-0 right-0">
      <SongBasicDetail @playerAll="playerAll" :playlist="playlistDetail" />
      <SongCollection :playlist-tracks="detailLists" />
      <div v-if="loadGengdDuo && loadBtn" class="w-full pb-8 flex justify-center">
        <el-button class="flex items-center justify-center" @click="loadSong">
          <span v-if="loadmore">加载更多</span>
          <Loading v-else />
        </el-button>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { songDetail, songDetailAll } from "../../api/songdetail";
import { musicDetail, musicResultDetail } from "../../utils/musicDetail";
import transformSongDetails from "./utils/transformSongDetails";

import { ElButton, ElContainer, ElMain, ElMessage } from "element-plus";
import SongBasicDetail from "./components/SongBasicDetail.vue";
import SongCollection from "./components/SongCollection.vue";
import Loading from "../../components/svgloading/SvgLoading.vue";
import dexie from "../../common/dexie";

const route = useRoute();
const store = useStore();

const detailLists = ref<musicDetail[]>([]);
const playlistDetail = ref({});
const loadBtn = ref(false);
let offset = 1;
let first = true;
const loadmore = ref(true);
const mydexie = dexie();

const songTrasf = (detaillist) => {
  const key = Object.prototype.hasOwnProperty.call(detaillist.data, "playlist")
    ? "playlist"
    : "songs";

  const lists = detaillist.data[key];
  const songLists = key === "playlist" ? lists.tracks : lists;
  detailLists.value.push(...songLists.map((detail) => musicResultDetail(detail)));

  if (first) {
    loadBtn.value = true;
    first = false;
  }

  JSON.stringify(playlistDetail.value) === "{}" &&
    (playlistDetail.value = transformSongDetails(detaillist.data.playlist));
};

function loadSong() {
  loadmore.value = false;
  songDetailAll(route.query.id as unknown as number, offset)
    .then((songs) => {
      songTrasf(songs);
      offset += 1;
    })
    .catch((err) => {
      console.log(err);
      ElMessage({ message: "歌曲加载错误！", type: "error" });
    })
    .finally(() => (loadmore.value = true));
}

songDetail(route.query.id as unknown as number).then(songTrasf);

async function playerAll() {
  const db = await mydexie;
  const musiclists = detailLists.value;
  db.put(null, null, musiclists, true);
}

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
