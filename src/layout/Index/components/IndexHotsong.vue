<template>
  <HeadTitle title="最新歌曲" />
  <NotableVue :pagecount="allCount()" @current-page="currentPage">
    <template v-slot:left>
      <div
        v-for="(leftSongs, leftindex) in lefts"
        :key="leftindex"
        class="w-1/2 h-full flex flex-col flex-1 items-center justify-center"
      >
        <ElRow class="w-full py-2" v-for="(song, songindex) in leftSongs" :key="songindex">
          <ElCol :span="5">
            <ElAvatar shape="square" :src="song.picUrl + '?param=42y42'" :size="42"></ElAvatar>
          </ElCol>
          <ElCol :span="14" class="flex items-center justify-center">
            <ElRow style="color: #545499" class="w-full flex justify-between">
              <ElCol :span="10" class="truncate"> {{ song.name }} </ElCol>
              <ElCol :span="10" class="truncate">
                {{ manyAuthorsz(song.singerInfo) }}
              </ElCol>
              <ElCol :span="4">{{ filterDate(song.dt) }}</ElCol>
            </ElRow>
          </ElCol>
          <ElCol :span="5" class="flex justify-center items-center">
            <FontIcon @click="addNewSong(song.id)" icon="icontianjia" size="20"></FontIcon>
          </ElCol>
        </ElRow>
      </div>
    </template>
    <template v-slot:midd>
      <div
        v-for="(middSongs, middindex) in midds"
        :key="middindex"
        class="w-1/2 h-full flex flex-col flex-1 items-center justify-center"
      >
        <ElRow class="w-full py-2" v-for="(song, songindex) in middSongs" :key="songindex">
          <ElCol :span="5">
            <ElAvatar shape="square" :src="song.picUrl + '?param=42y42'" :size="42"></ElAvatar>
          </ElCol>
          <ElCol :span="14" class="flex items-center justify-center">
            <ElRow style="color: #545499" class="w-full flex justify-between">
              <ElCol :span="10" class="truncate"> {{ song.name }} </ElCol>
              <ElCol :span="10" class="truncate">
                {{ manyAuthorsz(song.singerInfo) }}
              </ElCol>
              <ElCol :span="4">{{ filterDate(song.dt) }}</ElCol>
            </ElRow>
          </ElCol>
          <ElCol :span="5" class="flex justify-center items-center">
            <FontIcon @click="addNewSong(song.id)" icon="icontianjia" size="20"></FontIcon>
          </ElCol>
        </ElRow>
      </div>
    </template>
    <template v-slot:right>
      <div
        v-for="(rightSongs, rightindex) in rights"
        :key="rightindex"
        class="w-1/2 h-full flex flex-col flex-1 items-center justify-center"
      >
        <ElRow class="w-full py-2" v-for="(song, songindex) in rightSongs" :key="songindex">
          <ElCol :span="5">
            <ElAvatar shape="square" :src="song.picUrl + '?param=42y42'" :size="42"></ElAvatar>
          </ElCol>
          <ElCol :span="14" class="flex items-center justify-center">
            <ElRow style="color: #545499" class="w-full flex justify-between">
              <ElCol :span="10" class="truncate"> {{ song.name }} </ElCol>
              <ElCol :span="10" class="truncate">
                {{ manyAuthorsz(song.singerInfo) }}
              </ElCol>
              <ElCol :span="4">{{ filterDate(song.dt) }}</ElCol>
            </ElRow>
          </ElCol>
          <ElCol :span="5" class="flex justify-center items-center">
            <FontIcon @click="addNewSong(song.id)" icon="icontianjia" size="20"></FontIcon>
          </ElCol>
        </ElRow>
      </div>
    </template>
  </NotableVue>
</template>
<script setup lang="tsx">
import { Ref, ref, watchEffect } from "vue";

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

const { lefts, midds, rights } = useSongsLists(currPageIndex);

function manyAuthorsz(artists: any) {
  return artists.map((value) => value.name).join("/");
}

function addNewSong(id: number) {
  store.commit("playlist/setSongId", id);
}

function allCount() {
  return Math.floor(newTopSongs.value.length / (SLICE_COUNT * 2));
}

function currentPage(curpaeg: number) {
  currPageIndex.value = curpaeg;
}

function songSlice(sliceindex: number) {
  //slice =  页数数目 * (截取页数)
  return [
    newTopSongs.value.slice(SLICE_COUNT * sliceindex, SLICE_COUNT * (sliceindex + 1)),
    newTopSongs.value.slice(SLICE_COUNT * (sliceindex + 1), SLICE_COUNT * (sliceindex + 2)),
  ];
}

function useSongsLists(pageindex: Ref<number>) {
  //当前页数
  const midds = ref([]);
  //当前页数的前一页
  const lefts = ref([]);
  //当前页数的后一页
  const rights = ref([]);

  watchEffect(() => {
    //[midd,left,right]
    const sliceArr = [pageindex.value, pageindex.value - 1, pageindex.value + 1];

    midds.value = songSlice(sliceArr[0]);
    lefts.value = sliceArr[1] < 0 ? [] : songSlice(sliceArr[1]);
    rights.value = sliceArr[2] > newTopSongs.value.length - 1 ? [] : songSlice(sliceArr[2]);
  });

  return {
    midds,
    lefts,
    rights,
  };
}
</script>
<style scoped lang="scss"></style>
