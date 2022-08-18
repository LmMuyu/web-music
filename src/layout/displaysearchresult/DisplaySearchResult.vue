<template>
  <ElContainer class="bg-white" style="height: 100vh">
    <ElMain style="overflow: hidden">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单曲" name="song">
          <AsyncSuspense>
            <DisplaySongSearch :data="searchData.song.data">
              <Pagination
                @currpage="currPage"
                :total="searchData.song.total"
                :count="searchData.song.count"
                v-if="LIMIT_MAX <= searchData.song.total"
              />
            </DisplaySongSearch>
          </AsyncSuspense>
        </el-tab-pane>
        <el-tab-pane label="专辑" name="album">
          <AsyncSuspense>
            <DisplayAlbum :data="searchData.album.data">
              <Pagination
                @currpage="currPage"
                :total="searchData.album.total"
                :count="searchData.album.count"
                v-if="LIMIT_MAX <= searchData.album.total"
              />
            </DisplayAlbum>
          </AsyncSuspense>
        </el-tab-pane>
        <el-tab-pane label="歌手" name="singer">
          <AsyncSuspense>
            <DisplaySinger :data="searchData.singer.data">
              <Pagination
                @currpage="currPage"
                :total="searchData.singer.total"
                :count="searchData.singer.count"
                v-if="LIMIT_MAX <= searchData.singer.total"
              />
            </DisplaySinger>
          </AsyncSuspense>
        </el-tab-pane>
        <el-tab-pane label="歌单" name="playlist">
          <AsyncSuspense>
            <DisplayPlaylist :data="searchData.playlist.data">
              <Pagination
                @currpage="currPage"
                :total="searchData.playlist.total"
                :count="searchData.playlist.count"
                v-if="LIMIT_MAX <= searchData.playlist.total"
              />
            </DisplayPlaylist>
          </AsyncSuspense>
        </el-tab-pane>
        <el-tab-pane label="视频" name="video">
          <AsyncSuspense>
            <DisplayVideo :data="searchData.video.data">
              <Pagination
                @currpage="currPage"
                :total="searchData.video.total"
                :count="searchData.video.count"
                v-if="LIMIT_MAX <= searchData.video.total"
              />
            </DisplayVideo>
          </AsyncSuspense>
        </el-tab-pane>
        <el-tab-pane label="MV" name="mv">
          <MvLists :rootlist="searchData.mv.data"> </MvLists>
        </el-tab-pane>
        <el-tab-pane label="用户" name="user">
          <AsyncSuspense>
            <DisplayUser :data="searchData.user.data">
              <Pagination
                @currpage="currPage"
                :total="searchData.user.total"
                :count="searchData.user.count"
                v-if="LIMIT_MAX <= searchData.user.total"
              />
            </DisplayUser>
          </AsyncSuspense>
        </el-tab-pane>
      </el-tabs>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, ref, onActivated } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

import { cloudSearch } from "../../api/displaysearchreult";
import { PlayList, User } from ".";

import { ElContainer, ElMain, ElTabPane, ElTabs } from "element-plus";
import Pagination from "./components/Pagination.vue";

import { transformArtistData } from "../user/home/hooks/Home";
import { musicDetail } from "../../utils/musicDetail";

import type { TabsPaneContext } from "element-plus";
import { videoDetail } from "../video/hooks/data";

const MvLists = defineAsyncComponent(() => import("../mv/components/Lists.vue"));
const DisplayUser = defineAsyncComponent(() => import("./components/DisplayUser.vue"));
const DisplayAlbum = defineAsyncComponent(() => import("./components/DisplayAlbum.vue"));
const DisplayVideo = defineAsyncComponent(() => import("./components/DisplayVideo.vue"));
const DisplaySinger = defineAsyncComponent(() => import("./components/DisplaySinger.vue"));
const DisplayPlaylist = defineAsyncComponent(() => import("./components/DisplayPlaylist.vue"));
const DisplaySongSearch = defineAsyncComponent(() => import("./components/DisplaySongSearch.vue"));

const typekeyword = {
  1: "单曲",
  10: "专辑",
  100: "歌手",
  1000: "歌单",
  1002: "用户",
  1004: "MV",
  1014: "视频",
};

const english = {
  单曲: "song",
  专辑: "album",
  歌手: "singer",
  歌单: "playlist",
  用户: "user",
  MV: "mv",
  视频: "video",
};

const LIMIT_MAX = 30;
const route = useRoute();
const router = useRouter();
const type = ref(route.query.type as string);
const keyword = ref(route.query.keyword as string);

const activeName = ref(english[type.value]);
const searchData = reactive({
  song: {
    data: [],
    total: 0,
    count: 0,
  },
  album: {
    data: [],
    total: 0,
    count: 0,
  },
  singer: {
    data: [],
    total: 0,
    count: 0,
  },
  playlist: {
    data: [],
    total: 0,
    count: 0,
  },
  video: {
    data: [],
    total: 0,
    count: 0,
  },
  mv: {
    data: [],
    total: 0,
    count: 0,
  },
  user: {
    data: [],
    total: 0,
    count: 0,
  },
});

function handleClick(tab: TabsPaneContext | { props: { name: string; label: string } }) {
  console.log(tab.props.name);

  goRouterPath(tab.props.label);
  const cs_p = cloudSearch(keyword.value, valuetokey.get(tab.props.label), LIMIT_MAX);

  if (tab.props.name === "album") {
    cs_p.then((data) => {
      searchData.album.count = LIMIT_MAX;
      searchData.album.total = data.data.result.albumCount;
      searchData.album.data = data.data.result.albums;
    });
  } else if (tab.props.name === "singer") {
    cs_p.then((data) => {
      searchData.singer.count = LIMIT_MAX;
      searchData.singer.total = data.data.result.artistCount;
      searchData.singer.data = data.data.result.artists.map((artist) =>
        transformArtistData(artist)
      );
    });
  } else if (tab.props.name === "playlist") {
    cs_p.then((data) => {
      searchData.playlist.count = LIMIT_MAX;
      searchData.playlist.total = data.data.result.playlistCount;
      searchData.playlist.data = data.data.result.playlists.map(
        (playlist) => new PlayList(playlist)
      );
    });
  } else if (tab.props.name === "video") {
    cs_p.then((data) => {
      searchData.video.count = LIMIT_MAX;
      searchData.video.total = data.data.result.videoCount;
      searchData.video.data = data.data.result.videos.map((video) => new videoDetail(video));
    });
  } else if (tab.props.name === "mv") {
    cs_p.then((data) => {
      searchData.mv.count = LIMIT_MAX;
      searchData.mv.total = data.data.result.mvCount;
      searchData.mv.data = data.data.result.mvs;
    });
  } else if (tab.props.name === "user") {
    cs_p.then((data) => {
      searchData.user.count = LIMIT_MAX;
      searchData.user.total = data.data.result.userprofileCount;
      searchData.user.data = data.data.result.userprofiles.map((user) => new User(user));
    });
  } else if (tab.props.name === "song") {
    cs_p.then((data) => {
      searchData.song.total = data.data.result.songCount;
      searchData.song.count = LIMIT_MAX;
      musicSongs(data.data.result.songs);
    });
  } else {
    console.error("没有找到对应的type的ID");
  }
}

function mappingmap(keyword: typeof typekeyword) {
  const keytovalue = new Map(),
    valuetokey = new Map();

  for (const key in keyword) {
    keytovalue.set(key, keyword[key]);
    valuetokey.set(keyword[key], key);
  }

  return {
    keytovalue,
    valuetokey,
  };
}

const { valuetokey } = mappingmap(typekeyword);

function musicSongs(data: any[]) {
  searchData.song.data = data.map((song) => new musicDetail(song));
}

handleClick({
  props: {
    name: english[type.value],
    label: type.value,
  },
});

function currPage(page: number) {
  cloudSearch(keyword.value, valuetokey.get(type), LIMIT_MAX, page).then((data) => {
    searchData.song.total = data.data.result.songCount;
    searchData.song.count = LIMIT_MAX;
    musicSongs(data.data.result.songs);
  });
}

function goRouterPath(labeltype: string) {
  router.replace({
    path: "/searchres",
    query: {
      keyword: keyword.value,
      type: labeltype,
    },
  });

  type.value = labeltype;
}

//生命周期

onActivated(() => {
  type.value = route.query.type as string;
  keyword.value = route.query.keyword as string;

  for (const key in searchData) {
    if (Object.prototype.hasOwnProperty.call(searchData, key)) {
      searchData[key].data = [];
      searchData[key].total = 0;
      searchData[key].count = 0;
    }
  }
});

onBeforeRouteUpdate((route) => {
  const query = route.query;
  type.value = query.type as string;
  keyword.value = query.keyword as string;
});
</script>
<style scoped lang="scss"></style>
