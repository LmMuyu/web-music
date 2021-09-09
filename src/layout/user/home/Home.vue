<template>
  <ElContainer>
    <ElMain>
      <HomeUserInfo :profile="userinfo.profile" />
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";

import { getUserDetail } from "../../../api/user";

import HomeUserInfo from "./components/HomeUserInfo.vue";
import { ElContainer, ElMain } from "element-plus";

const route = useRoute();
const uid = route.query.uid as string;

console.log(123);

const userinfo = ref<any>({});

getUserDetail(uid)
  .then((detail) => {
    userinfo.value = detail.data;
  })
  .catch((err) => {
    console.log(err);
  });
</script>
<style scoped lang="scss"></style>
