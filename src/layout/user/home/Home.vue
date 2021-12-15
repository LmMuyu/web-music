<template>
  <ElContainer class="h-full">
    <ElHeader height="100" class="flex items-center">
      <div v-if="Object.keys(userinfo).length > 0" class="flex">
        <ElAvatar size="medium" :src="userinfo?.userInfo.avatarUrl" />
        <div>
          <span class="text-2xl px-2"> {{ userinfo.userInfo.nickname }}的音乐库 </span>
        </div>
      </div>
    </ElHeader>
    <ElMain>
      <div class="flex" style="height: 30vh">
        <div class="w-1/3">
          <HomeLLikeMusic :linkelen="linkeLen"></HomeLLikeMusic>
        </div>
        <div class="w-2/3">
          <HomeLLinkeLists />
        </div>
      </div>
      <div>
        <HomeHeadSelect @songs="selectSong" />
      </div>
      <div>
        <Component :songlist="songlist" :selectTag="selectTag" :is="contentComps"></Component>
      </div>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { ref, shallowRef } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { obtainUserPlayList, getUserDetail, llikelist, getSubCount } from "../../../api/user";
import { listDetail } from "../../../api/toplist";

import { ElContainer, ElMain, ElHeader, ElAvatar } from "element-plus";
import HomeSongList from "./components/HomeSongList.vue";
import HomeLLikeMusic from "./components/HomeLLikeMusic.vue";
import HomeHeadSelect from "./components/HomeHeadSelect.vue";
import HomeLLinkeLists from "./components/HomeLLinkeLists.vue";

const route = useRoute();
const store = useStore();

const uid = ref(route.query.uid as string);
const ids = ref([]);
const linkeLen = ref(0);
const userinfo = ref<any>({});
const songlist = ref<any[]>([]);
const contentComps = shallowRef(HomeSongList);
const selectTag = ref<"all" | "linke" | "sub">("all");

function selectSong(select: string) {
  switch (select) {
    case "全部歌单":
      selectTag.value = "all";
      return;

    case "创建的歌单":
      selectTag.value = "linke";
      return;

    case "收藏的歌单":
      selectTag.value = "sub";
      return;
  }
}

function loginInfo() {
  return new Promise((resolve) => {
    store.commit("login/onMittEvent", async (userinofobj: any) => {
      if (Object.keys(userinofobj).length > 0) {
        userinfo.value = userinofobj.value;
        uid.value = userinfo.value.account.id;

        resolve(userinofobj.islogin);
      } else {
        resolve(false);
      }
    });
  });
}

(async function () {
  const islogin = await loginInfo();

  try {
    if (!islogin) {
      // const detail = await getUserDetail(uid);
      // userinfo.value = detail.data;
    } else {
      // getSubCount().then((rs) => {
      //   console.log(rs);
      // });
    }

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
</script>
<style scoped lang="scss">
.flexdir {
  flex-direction: column !important;
}
</style>
