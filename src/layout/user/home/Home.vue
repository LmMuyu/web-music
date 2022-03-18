<template>
  <ElContainer class="h-full bg-white">
    <ElHeader height="100" class="flex items-center py-4">
      <div v-if="Object.keys(userinfo).length > 0" class="flex py-2">
        <ElAvatar size="medium" :src="userinfo.avatarUrl" />
        <div>
          <span class="text-2xl px-2"> {{ userinfo.nickname }}的音乐库 </span>
        </div>
      </div>
    </ElHeader>
    <ElMain class="container_main">
      <div class="flex" style="height: 30vh">
        <div class="w-1/3">
          <HomeLLikeMusic :linkelen="linkeLen"></HomeLLikeMusic>
        </div>
        <div class="w-2/3">
          <HomeLLinkeLists :linkeLists="linkeLists" />
        </div>
      </div>
      <div>
        <HomeHeadSelect @songs="selectViewComps" @selectTag="selectViewComps" />
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

import { obtainUserPlayList, llikelist, subArtist, getCloud } from "../../../api/user";

import { ElContainer, ElMain, ElHeader, ElAvatar } from "element-plus";
import HomeArtist from "./components/HomeArtist.vue";
import HomeSongList from "./components/HomeSongList.vue";
import HomeLLikeMusic from "./components/HomeLLikeMusic.vue";
import HomeHeadSelect from "./components/HomeHeadSelect.vue";
import HomeLLinkeLists from "./components/HomeLLinkeLists.vue";
import HomeCloudDisk from "./components/HomeCloudDisk.vue";

const route = useRoute();
const store = useStore();

const uid = ref(route.query.uid as string);
const ids = ref([]);
const linkeLen = ref(0);
const artistlist = ref([]);
const cloudDiskData = ref([]);
const userinfo = ref<any>({});
const songlist = ref<any[]>([]);
const linkeLists = ref<any[]>([]);
const contentComps = shallowRef<any>(HomeSongList);
const selectTag = ref<"all" | "linke" | "sub" | "">("all");

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
    const computedUserData = computed(() => {
      return store.getters["login/getUserData"]();
    });

    const stopWatch = watchEffect((oninvalidata) => {
      if (Object.keys(computedUserData.value).length > 0) {
        if (isself === "1") {
          userinfo.value = computedUserData.value;
          uid.value = computedUserData.value.userID;
          console.log(uid.value);
          resolve({
            islogin: true,
            stopWatch,
          });
        } else {
          resolve({
            islogin: false,
            stopWatch,
          });
        }
      }
    });
  });
}

(async function () {
  const { islogin, stopWatch } = await loginInfo();
  stopWatch();

  try {
    if (islogin) {
      getCloud().then((cloud) => {
        cloudDiskData.value.push(cloud.data);
      });
    }

    subArtist().then((sub) => {
      artistlist.value = sub.data.data.map((artist) => transformArtistData(artist));
    });

    obtainUserPlayList(uid.value).then(async (sub) => {
      if (sub.data.playlist.length > 0) {
        songlist.value.push(...sub.data.playlist);
      }
    });

    const likelist = await llikelist(uid.value);
    ids.value.push(...likelist.data.ids);
    linkeLen.value = ids.value.length;

    store.dispatch("login/getlinke", ids.value);
  } catch (error) {
    console.error("状态码:" + error.data.status);
  }
})();

function transformArtistData(artist: any) {
  return {
    coverImgUrl: artist.picUrl,
    name: artist.name,
    path: "/user/home",
    isPlayIcon: false,
    id: artist.id,
    style: {
      name: `
      font-weight:bold;
      color:#606266;
      font-size:18px;
      `,
    },
    xsize: 512,
    ysize: 512,
  };
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
