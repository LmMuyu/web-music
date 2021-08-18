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
import { ref } from "vue";

import { loginStateus } from "./api/app/login";
import loginApp from "./view/login/login";


import Main from "./layout/main/Main.vue";

import type { State, UserInfo } from "./store/type";
import type { RouteLocationNormalized } from "vue-router"

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

store.dispatch("countriesCode");

const userInfo = ref<UserInfo | null>(null);
const showTag = ref(false);
const linkType = ref<linkType>("info");

const pathList = ["/message", "/subscription"];

async function redirectPath(to: RouteLocationNormalized, path: string) {
  await loginStateus();
  const loginstateus = (store.state as State).loginState;

  if (loginstateus === 301 && pathList.includes(path) && path !== "/index") {
    console.info("未登录,登录状态为:" + loginstateus);

    loginApp()//未登录时,调用登录框
    router.replace({ path: "/index" });
    // store.commit("runActiveTagFn", [null, { path: "/index" }])
  }
}

router.beforeEach((to, from) => {
  redirectPath(to, to.path);

  const meta = to.meta;

  if (meta.hasOwnProperty("showTag")) {
    showTag.value = meta.showTag as boolean;
  }

  if (to.path === "/login" && store.getters.getStatus === 200) {
    router.push("/index")
  }
});

store.watch(
  () => store.state.userInfo,
  (value: UserInfo | null) => {
    userInfo.value = value;
  }
);
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

.grid_ul > li {
  width: v-bind(gridWidth);
}

.rounded {
  border-radius: 50%;
}

#app {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
