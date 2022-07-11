<template>
  <ElContainer class="h-full bg-white">
    <ElHeader :height="issinger ? '200px' : '100px'" class="flex items-center py-4">
      <div v-if="Object.keys(userinfo).length > 0 && !issinger" class="flex py-2">
        <ElAvatar size="medium" :src="userinfo.avatarUrl" />
        <div>
          <span class="text-2xl px-2"> {{ userinfo.nickname }}的音乐库 </span>
        </div>
      </div>
      <div v-else class="w-full">
        <HomeSingerInfo :singerinfo="userinfo" />
      </div>
    </ElHeader>
    <ElMain class="container_main">
      <div v-if="!issinger" class="flex" style="height: 30vh">
        <div class="w-1/3">
          <HomeLLikeMusic :linkelen="linkeLen" @playermusic="playermusic"></HomeLLikeMusic>
        </div>
        <div class="w-2/3">
          <HomeLLinkeLists :linkeLists="linkeLists" />
        </div>
      </div>

      <div>
        <HomeHeadSelect
          @songs="selectViewComps"
          @selectTag="selectViewComps"
          :issinger="issinger"
        />
      </div>
      <div>
        <keep-alive>
          <Component
            :songlist="songlist"
            :selectTag="selectTag"
            :artistlist="artistlist"
            :cloudDiskData="cloudDiskData"
            :is="contentComps"
          ></Component>
        </keep-alive>
      </div>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { computed, watchEffect, WatchStopHandle } from "vue";
import { ref, shallowRef } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { getMusicDetail } from "../../../api/playList";
import { musicDetail } from "../../../utils/musicDetail";
import HomeLLinkeListsPlay from "./hooks/HomeLLinkeListsPlay";
import {
  obtainUserPlayList,
  llikelist,
  subArtist,
  getCloud,
  artistdetail,
  singerAlbum,
} from "../../../api/user";
import { transformArtistData } from "./hooks/Home";
import { albumDateil, SingetInfo } from "./hooks/singer";

import HomeArtist from "./components/HomeArtist.vue";
import HomeSongList from "./components/HomeSongList.vue";
import HomeCloudDisk from "./components/HomeCloudDisk.vue";
import HomeLLikeMusic from "./components/HomeLLikeMusic.vue";
import HomeHeadSelect from "./components/HomeHeadSelect.vue";
import HomeSingerInfo from "./components/HomeSingerInfo.vue";
import HomeLLinkeLists from "./components/HomeLLinkeLists.vue";
import { ElContainer, ElMain, ElHeader, ElAvatar } from "element-plus";

const route = useRoute();
const store = useStore();

const uid = ref(route.query.uid as string);
const ids = ref([]);
const linkeLen = ref(0);
const artistlist = ref([]);
const cloudDiskData = ref([]);
const userinfo = ref<any>({});
const songlist = ref<any[]>([]);
const linkeLists = ref<musicDetail[]>([]);
const issinger = ref(ifIsSinger(route.params.issinger));
const contentComps = shallowRef<any>(HomeSongList);
const selectTag = ref<"all" | "linke" | "sub" | "">("all");

const { playermusic } = HomeLLinkeListsPlay(linkeLists);

function selectViewComps(select: string) {
  switch (select) {
    case "全部歌单":
      contentComps.value = HomeSongList;
      selectTag.value = "all";
      return;
    case "创建的歌单":
      contentComps.value = HomeSongList;
      selectTag.value = "linke";
      return;
    case "收藏的歌单":
      contentComps.value = HomeSongList;
      selectTag.value = "sub";
      return;
    case "艺人":
      contentComps.value = HomeArtist;
      selectTag.value = "";
      return;
    case "云盘":
      contentComps.value = HomeCloudDisk;
      selectTag.value = "";
      return;
  }
}

function loginInfo(): Promise<{
  islogin: boolean;
  stopWatch: WatchStopHandle;
}> {
  return new Promise((resolve) => {
    const isself = route.query.isself as string | number;
    const _resolve = Promise.resolve();
    const computedUserData = computed(() => {
      return store.getters["login/getUserData"]();
    });

    const stopWatch = watchEffect((oninvalidata) => {
      const userdata = computedUserData.value.data;
      if (!userdata) {
        return;
      }

      if (Object.keys(userdata).length > 0) {
        computedUserData.effect.stop();

        if (isself === "1") {
          userinfo.value = userdata;
          uid.value = userdata.userID;
          _resolve.then(() => resolve({ islogin: true, stopWatch }));
        } else {
          _resolve.then(() => resolve({ islogin: false, stopWatch }));
        }
      }
    });
  });
}

(async function () {
  try {
    if (!issinger.value) {
      const { islogin, stopWatch } = await loginInfo();
      stopWatch();

      if (islogin) {
        getCloud().then((cloud) => {
          cloudDiskData.value.push(cloud.data);
        });
      }

      subArtist().then((sub) => {
        artistlist.value = sub.data.data.map((artist) => transformArtistData(artist));
      });

      obtainUserPlayList(uid.value)
        .then(async (sub) => {
          if (sub.data.playlist.length > 0) {
            songlist.value.push(...sub.data.playlist);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      const likelist = await llikelist(uid.value);

      ids.value.push(...likelist.data.ids);
      linkeLen.value = ids.value.length;
      const strids = ids.value.join(",");

      getMusicDetail(strids).then((sources) => {
        linkeLists.value = sources.data.songs.map((song) => new musicDetail(song));
      });
    } else {
      artistdetail(Number(uid.value)).then((singer) => {
        userinfo.value = new SingetInfo(singer.data.data);
      });

      singerAlbum(Number(uid.value)).then((albums) => {
        // songlist.value.push(albums.data.hotAlbums.map((album) => new albumDateil(album)));
      });
    }
  } catch (error) {
    console.error("状态码:" + error.data.status);
  }
})();

function ifIsSinger(issinger) {
  if (issinger === undefined) {
    return false;
  }

  if (issinger === "true") {
    return true;
  }
  return false;
}
</script>
<style scoped lang="scss">
.flexdir {
  flex-direction: column !important;
}

.container_main {
  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-track {
    display: none;
  }
}
</style>
