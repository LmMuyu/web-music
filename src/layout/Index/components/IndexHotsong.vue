<template>
  <HeadTitle title="最新歌曲" />
  <div class="flex">
    <div class="w-1/2 flex-1">
      <newTopSongItem
        v-for="(song, index) in newTopSongs.slice(0, 4)"
        :key="index"
        :avatarSrc="song.artists[0].picUrl + '?param=42y42'"
        :duration="filterDate(song.duration)"
        :artists="song.artists"
        :name="song.name"
        :id="song.id"
      />
    </div>
    <div class="w-1/2 flex-1">
      <newTopSongItem
        v-for="(song, index) in newTopSongs.slice(4, 8)"
        :key="index"
        :avatarSrc="song.artists[0].picUrl + '?param=42y42'"
        :duration="filterDate(song.duration)"
        :name="song.name"
        :artists="song.artists"
        :id="song.id"
      />
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref } from "vue";

import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { ElRow, ElCol, ElAvatar } from "element-plus";
import HeadTitle from "./IndexModuleHeadTitle.vue";

import filterDate from "../../../utils/filterDate";
import { topSong } from "../../../api/index";
import { useStore } from "vuex";

const store = useStore();

const newTopSongs = ref([]);
newTopSongs.value = (await topSong()).data.data;

function manyAuthorsz(artists: any[]) {
  return artists.map((value) => value.name).join("/");
}

function addNewSong(id: number) {
  store.commit("playlist/setSongId", id);
}

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
