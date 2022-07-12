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
          <router-link :to="routerLinkTemp(item.id)">
            <el-avatar shape="square" :size="60" :src="item.picUrl + '?param=60y60'"> </el-avatar>
          </router-link>
        </el-col>
        <el-col :span="10" style="color: #7474ad" class="relative">
          <router-link
            :to="routerLinkTemp(item.id)"
            class="absolute top-0 left-0 w-full h-full flex flex-col justify-center"
          >
            <span> {{ item.name }} </span>
            <span class="text-sm leading-6"> {{ item.musicSize }} 首歌曲 </span>
          </router-link>
        </el-col>
        <el-col :span="4" class="flex justify-center">
          <font-icon
            @click="
              store.dispatch('login/follow', { uid: item.accountId, backcall: followBackCall })
            "
            icon="iconxihuan"
            color="#7474ad"
            size="18"
          ></font-icon>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { artistList } from "../../../api/index";
import { margin_right } from "../hook";
import { useStore } from "vuex";

import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { ElRow, ElCol, ElAvatar } from "element-plus";
import HeadTitle from "./IndexModuleHeadTitle.vue";

import type { follow } from "../../../store/modules/module_login";

const store = useStore();
const artists = ref([]);

function followBackCall(follow: follow) {
  console.log(follow);
}

function artistRandom(artists: any[]) {
  const songlists = artists.slice(0);
  const len = songlists.length;

  for (let i = 0; i < songlists.length; i++) {
    const randomCount = Math.floor(Math.random() * (len - 1));
    [songlists[i], songlists[randomCount]] = [songlists[randomCount], songlists[i]];
  }
  return songlists;
}
const serveArtists = (await artistList()).data.artists;
artists.value = artistRandom(serveArtists);

function routerLinkTemp(id: number) {
  return {
    name: "UserHome",
    query: {
      uid: id,
      isself: true,
      issinger: true,
    },
  };
}
</script>
<style scoped lang="scss"></style>
