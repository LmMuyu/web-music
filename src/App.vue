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
import { promptbox } from "./components/promptBox";

import Main from "./layout/main/Main.vue";

import type { State, UserInfo } from "./store/type";
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

store.dispatch("countriesCode");

async function redirectPath(to: RouteLocationNormalized) {
  const pathList = ["/message", "/subscription"];

  await loginStateus();
  const islogin: boolean = store.dispatch["login/getIslogin"];

  if (islogin && pathList.includes(to.path) && to.path !== "/index") {
    promptbox({ mountNode: "body", title: "请先登录!" });
    router.replace({ path: "/index" });
  }
}

router.beforeEach((to, from) => {
  redirectPath(to);

  const meta = to.meta;

  if (meta.hasOwnProperty("showTag")) {
    showTag.value = meta.showTag as boolean;
  }

  if (to.path === "/login" && store.getters.getStatus === 200) {
    router.push("/index");
  }
});

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
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
