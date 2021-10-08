<template>
  <Main>
    <router-view v-slot="{ Component, route }">
      <keep-alive v-if="route.meta.KeepAlive ?? true">
        <component :is="Component" />
      </keep-alive>
      <component :is="Component" v-else />
    </router-view>
  </Main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { provide, ref } from "vue";

import { loginStateus } from "./api/app/login";
import { promptbox } from "./components/promptBox";

import Main from "./layout/main/Main.vue";

import type { UserInfo } from "./store/type";
import type { RouteLocationNormalized } from "vue-router";

type linkType =
  | "info"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "default"
  | undefined;

const store = useStore();
const router = useRouter();

const showTag = ref(false);
const linkType = ref<linkType>("info");
const userInfo = ref<UserInfo | null>(null);
const circleRef = ref(true);

const pathList = ["/message", "/subscription"];

store.dispatch("countriesCode");
provide("pathlist", pathList);
provide("circleRef", circleRef);

function updateCircleRef() {
  let timer = setTimeout(() => {
    circleRef.value = false;

    Promise.resolve().then(() => {
      clearTimeout(timer);
      timer = null;
    });
  }, 1500);
}

async function redirectPath(to: RouteLocationNormalized, islogin: boolean) {
  await loginStateus();
  Promise.resolve().then(() => updateCircleRef());

  if (islogin && pathList.includes(to.path) && to.path !== "/index") {
    promptbox({ mountNode: "body", title: "请先登录!" });
    router.replace({ path: "/index" });
  }
}

router.beforeEach((to, from) => {
  const islogin: boolean = store.dispatch["login/getIslogin"];

  redirectPath(to, islogin);

  const meta = to.meta;

  if (meta.hasOwnProperty("showTag")) {
    showTag.value = meta.showTag as boolean;
  }

  if (to.path === "/login" && islogin) {
    router.push("/index");
  }
});

// router.beforeResolve((to) => {

// });

store.commit("login/onMittEvent", (value: any) => {
  userInfo.value = value.value as UserInfo;
});
</script>

<style lang="scss">
@import "./css/normalize.css";

@include Iconfont(red, 32);

.appicon {
  @include Iconfont(#dfe6e9, 14);
}

.text_in {
  line-height: inherit;
}

.rounded {
  border-radius: 50%;
}

#app {
  font-family: "Bahnschrift", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
