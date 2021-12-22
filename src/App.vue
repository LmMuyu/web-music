<template>
  <HtmlMain />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { provide, ref } from "vue";

import { loginStateus } from "./api/app/login";
import { promptbox } from "./components/promptBox";

import HtmlMain from "./layout/main/Main.vue";

import type { RouteLocationNormalized } from "vue-router";

type linkType = "info" | "primary" | "success" | "warning" | "danger" | "default" | undefined;

const store = useStore();
const router = useRouter();

const showTag = ref(false);
const linkType = ref<linkType>("info");
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
  const status = await loginStateus();
  console.log(status);

  Promise.resolve().then(() => updateCircleRef());

  if (islogin && pathList.includes(to.path) && to.path !== "/index") {
    promptbox({ mountNode: "body", title: "请先登录!" });
    router.replace({ path: "/index" });
  }
}

router.beforeEach((to) => {
  const islogin: boolean = store.dispatch["login/getIslogin"];
  redirectPath(to, islogin);

  if (to.path.indexOf("/login") > -1 && islogin) {
    router.push("/index");
  }
});
</script>

<style lang="scss">
@import "./css/normalize.css";

@include Iconfont(red, 32);

.appicon {
  @include Iconfont(#dfe6e9, 14);
}

.text_hover {
  @include Decoration_Hover;
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
