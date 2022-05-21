<template>
  <HeadTitle title="最新歌曲" />
  <NotableVue :pagecount="allCount()" @current-page="currentPage">
    <div class="w-1/2 flex-1">
      <newTopSongItem
        v-for="(song, index) in leftTopSongs"
        :key="index"
        :avatarSrc="song.picUrl + '?param=42y42'"
        :duration="filterDate(song.dt)"
        :artists="song.singerInfo"
        :name="song.name"
        :id="song.id"
      />
    </div>
    <div class="w-1/2 flex-1">
      <newTopSongItem
        v-for="(song, index) in rightTopSongs"
        :key="index"
        :avatarSrc="song.picUrl + '?param=42y42'"
        :duration="filterDate(song.dt)"
        :name="song.name"
        :artists="song.singerInfo"
        :id="song.id"
      />
    </div>
  </NotableVue>
</template>
<script setup lang="tsx">
import { computed, ref } from "vue";

import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { ElRow, ElCol, ElAvatar } from "element-plus";
import HeadTitle from "./IndexModuleHeadTitle.vue";

import filterDate from "../../../utils/filterDate";
import { topSong } from "../../../api/index";
import { useStore } from "vuex";
import { musicDetail, musicResultDetail } from "../../../utils/musicDetail";
import NotableVue from "../../../components/notable/Notable.vue";

const store = useStore();

const SLICE_COUNT = 4;
const currPageIndex = ref(0);

const newTopSongs = ref<musicDetail[]>([]);
newTopSongs.value = (await topSong()).data.data.map((song) => musicResultDetail(song));

function manyAuthorsz(artists: any[]) {
  return artists.map((value) => value.name).join("/");
}

function addNewSong(id: number) {
  store.commit("playlist/setSongId", id);
}

function allCount() {
  return Math.ceil(newTopSongs.value.length / (SLICE_COUNT * 2));
}

function currentPage(curpaeg: number) {
  currPageIndex.value = curpaeg;
}

const leftTopSongs = computed(() =>
  newTopSongs.value.slice(
    SLICE_COUNT * (2 * currPageIndex.value),
    SLICE_COUNT * (2 * currPageIndex.value + 1)
  )
);
const rightTopSongs = computed(() =>
  newTopSongs.value.slice(
    SLICE_COUNT * (2 * currPageIndex.value + 1),
    SLICE_COUNT * (2 * currPageIndex.value + 2)
  )
);

function newTopSongItem(props) {
  const { avatarSrc, artists, name, duration, key, id } = props;

  return (
    <div key={key} class="h-20 flex flex-auto items-center">
      <ElRow class="h-10 w-full">
        <ElCol span={5}>
          <ElAvatar shape="square" src={avatarSrc} size={42}></ElAvatar>
        </ElCol>
        <ElCol span={14} class="flex items-center justify-center">
          <ElRow style="color: #545499" class="w-full flex justify-between">
            <ElCol span={10} class="truncate">
              {name}
            </ElCol>
            <ElCol span={10} class="truncate">
              {manyAuthorsz(artists)}
            </ElCol>
            <ElCol span={4}>{duration}</ElCol>
          </ElRow>
        </ElCol>
        <ElCol span={5} class="flex justify-center items-center">
          <FontIcon onClick={() => addNewSong(id)} icon="icontianjia" size="20"></FontIcon>
        </ElCol>
      </ElRow>
    </div>
  );
}
</script>
<style scoped lang="scss"></style>
