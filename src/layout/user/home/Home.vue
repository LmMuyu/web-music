<template>
  <ElContainer class="h-full">
    <ElMain>
      <div v-if="Object.keys(userinfo).length > 0">
        <HomeUserInfo :profile="userinfo.profile" />
      </div>
      <div v-if="songlist.length > 0">
        <HomeSongList :songlist="songlist" />
      </div>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";

import { obtainUserPlayList, getUserDetail } from "../../../api/user";

import HomeUserInfo from "./components/HomeUserInfo.vue";
import HomeSongList from "./components/HomeSongList.vue";
import { ElContainer, ElMain } from "element-plus";

const route = useRoute();
const uid = route.query.uid as string;

const userinfo = ref<any>({});
const songlist = ref<any[]>([]);

getUserDetail(uid)
  .then((detail) => {
    userinfo.value = detail.data;
  })
  .catch((err) => {
    console.log(err);
  });

obtainUserPlayList(uid).then((sub) => {
  if (sub.data.playlist.length > 0) {
    songlist.value.push(...sub.data.playlist);
  }
});
</script>
<style scoped lang="scss">
.flexdir {
  flex-direction: column !important;
}
</style>
