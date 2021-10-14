<template>
  <ElContainer class="h-full flex flexdir">
    <ElMain>
      <HomeUserInfo
        v-if="Object.keys(userinfo).length > 0"
        :profile="userinfo.profile"
      />
    </ElMain>
    <ElMain> </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";

import { obtainUserPlayList, getUserDetail } from "../../../api/user";

import HomeUserInfo from "./components/HomeUserInfo.vue";
import { ElContainer, ElMain } from "element-plus";

const route = useRoute();
const uid = route.query.uid as string;

const userinfo = ref<any>({});

getUserDetail(uid)
  .then((detail) => {
    userinfo.value = detail.data;
  })
  .catch((err) => {
    console.log(err);
  });

obtainUserPlayList(uid).then((sub) => {
  console.log(sub);
});
</script>
<style scoped lang="scss">
.flexdir {
  flex-direction: column !important;
}
</style>
