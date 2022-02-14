<template>
  <div class="w-full flex items-center justify-between">
    <HeadTitle title="有特色的歌手" />
    <div class="text-center">
      <span style="color: #545499"> 全部 </span>
    </div>
  </div>
  <div class="flex justify-between">
    <div
      class="w-56 h-24 bg-white rounded-md"
      v-for="(item, index) in artists.slice(0, 4)"
      :key="index"
      :class="margin_right(index + 1)"
    >
      <el-row class="p-4" style="color: #545499">
        <el-col :span="10">
          <el-avatar shape="square" :size="60" :src="item.picUrl + '?param=60y60'"> </el-avatar>
        </el-col>
        <el-col :span="10" style="color: #7474ad" class="flex flex-col items-center justify-center">
          <span> {{ item.name }} </span>
          <span class="text-sm leading-6"> {{ item.musicSize }} 首歌曲 </span>
        </el-col>
        <el-col :span="4" class="flex justify-center">
          <font-icon icon="iconxihuan" color="#7474ad" size="18"></font-icon>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { artistList } from "../../../api/index";
import { margin_right } from "../hook";

import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { ElRow, ElCol, ElAvatar } from "element-plus";
import HeadTitle from "./IndexModuleHeadTitle.vue";

const artists = ref([]);

function artistRandom(artists: any[]) {
  const songlists = artists.slice(0);

  for (let i = 0; i < songlists.length; i++) {
    const randomCount = Math.floor(Math.random() * songlists.length - 1);
    [songlists[i], songlists[randomCount]] = [songlists[randomCount], songlists[i]];
  }

  return songlists;
}
const serveArtists = (await artistList()).data.artists;
artists.value = artistRandom(serveArtists);
</script>
<style scoped lang="scss"></style>
