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
        <HomeLLikeMusic></HomeLLikeMusic>
        <div></div>
      </div>
      <div>
        <HomeHeadSelect @songs="selectSong" />
      </div>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { provide } from "vue";

import { obtainUserPlayList, getUserDetail } from "../../../api/user";

import { ElContainer, ElMain, ElHeader, ElAvatar } from "element-plus";
import HomeSongList from "./components/HomeSongList.vue";
import HomeLLikeMusic from "./components/HomeLLikeMusic.vue";
import HomeHeadSelect from "./components/HomeHeadSelect.vue";

const route = useRoute();
const store = useStore();
const uid = ref(route.query.uid);
provide("uid", uid);

const userinfo = ref<any>({});
const songlist = ref<any[]>([]);

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

function selectSong(select: string) {
  console.log(select);
}

(async function () {
  const islogin = await loginInfo();

  try {
    if (!islogin) {
      // const detail = await getUserDetail(uid);
      // userinfo.value = detail.data;
      // obtainUserPlayList(uid).then((sub) => {
      //   if (sub.data.playlist.length > 0) {
      //     songlist.value.push(...sub.data.playlist);
      //   }
      // });
    }
  } catch (error) {
    console.error("状态码:" + error.data.status);
  }
})();

provide("uid", uid); //home父组件全局注入uid
</script>
<style scoped lang="scss">
.flexdir {
  flex-direction: column !important;
}
</style>
