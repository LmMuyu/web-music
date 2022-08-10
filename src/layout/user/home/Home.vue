<template>
  <ElContainer class="h-full bg-white">
    <ElHeader
      :height="issinger ? '200px' : !isself ? '144px' : '100px'"
      class="flex items-center py-4"
    >
      <div v-if="Object.keys(userinfo).length > 0 && !issinger" class="flex py-2">
        <ElAvatar size="default" :src="userinfo.avatarUrl" />
        <div>
          <span class="text-2xl px-2"> {{ userinfo.nickname }}的音乐库 </span>
        </div>
      </div>
      <div v-else class="w-full">
        <HomeSingerInfo :singerinfo="userinfo" />
      </div>
    </ElHeader>
    <ElMain class="container_main">
      <div v-if="!issinger && isself" class="flex" style="height: 30vh">
        <div class="w-1/3">
          <HomeLLikeMusic
            :id="songlist?.[0]?.id ?? 0"
            :linkelen="linkeLen"
            @playermusic="playermusic"
          ></HomeLLikeMusic>
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
            :albums="albums"
            :is="contentComps"
            :videos="timelineVideo"
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
  simiSinger,
  albumSublist,
  mvSublist,
  getUserDetail,
} from "../../../api/user";
import { transformArtistData } from "./hooks/Home";
import { albumDateil, deputyInformation, SingetInfo } from "./hooks/singer";

import HomeAlbum from "./components/HomeAlbum.vue";
import HomeVideo from "./components/HomeVideo.vue";
import HomeArtist from "./components/HomeArtist.vue";
import HomeSongList from "./components/HomeSongList.vue";
import HomeCloudDisk from "./components/HomeCloudDisk.vue";
import HomeLLikeMusic from "./components/HomeLLikeMusic.vue";
import HomeHeadSelect from "./components/HomeHeadSelect.vue";
import HomeSingerInfo from "./components/HomeSingerInfo.vue";
import HomeLLinkeLists from "./components/HomeLLinkeLists.vue";

import { ElContainer, ElMain, ElHeader, ElAvatar } from "element-plus";
import { transformUserData } from "../../login/useBroadcastChannel";

const route = useRoute();
const store = useStore();

const ids = ref([]);
const albums = ref([]);
const linkeLen = ref(0);
const artistlist = ref([]);
const cloudDiskData = ref([]);
const userinfo = ref<any>({});
const timelineVideo = ref([]);
const songlist = ref<any[]>([]);
const linkeLists = ref<musicDetail[]>([]);
const uid = ref(route.query.uid as string);
const isself = ref(ifIsSinger(route.query.isself));
const contentComps = shallowRef<any>(HomeSongList);
const issinger = ref(ifIsSinger(route.query.issinger));
const selectTag = ref<"all" | "linke" | "sub" | "">("all");

const { playermusic } = HomeLLinkeListsPlay(linkeLists);

function selectViewComps(select: string) {
  const fSelect = filterSelect(select);
  console.log(fSelect);
  if (fSelect === -1) {
    throw new Error("select错误");
  }

  switch (fSelect) {
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
    case "专辑":
      contentComps.value = HomeAlbum;
      selectTag.value = "";
      return;
    case "视频":
      contentComps.value = HomeVideo;
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

        albumSublist().then((sublist) => {
          albums.value = sublist.data.data.map((artist) => new albumDateil(artist));
        });

        mvSublist().then((mvsublist) => {
          timelineVideo.value = mvsublist.data.data;
        });
      } else {
        getUserDetail(uid.value).then((user) => {
          const data = transformUserData(user.data.profile) as any;
          data.deputyInformation = new deputyInformation(data.userinfoData);
          userinfo.value = new SingetInfo(data);
        });
      }

      subArtist().then((sub) => {
        artistlist.value = sub.data.data.map((artist) => transformArtistData(artist));
      });

      obtainUserPlayList(uid.value)
        .then(async (sub) => {
          if (sub.data.playlist.length > 0) songlist.value.push(...sub.data.playlist);
        })
        .catch(console.log);

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

      singerAlbum(Number(uid.value)).then((albumlists) => {
        albums.value.push(...albumlists.data.hotAlbums.map((album) => new albumDateil(album)));
      });

      simiSinger(Number(uid.value)).then((simi) => {
        artistlist.value = simi.data.artists.map((artist) => transformArtistData(artist));
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

function filterSelect(select: string) {
  const hashTableArr = ["全部歌单", "创建的歌单", "收藏的歌单", "专辑", "艺人", "视频", "云盘"];

  const singerHashTable = {
    相似艺人: "艺人",
  };

  if (Object.prototype.hasOwnProperty.call(singerHashTable, select)) {
    return singerHashTable[select];
  } else if (hashTableArr.indexOf(select) > -1) {
    return select;
  } else {
    return -1;
  }
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
