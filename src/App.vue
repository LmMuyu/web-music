<template>
  <HtmlMain />
  <div class="absolute bottom-0 left-0 w-full">
    <Audio v-if="loadCompAudio" :songinfo="songInfo" />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, computed, watchEffect, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import HtmlMain from "./layout/main/Main.vue";

import { loginStateus } from "./api/app/login";
import { useWatchRoutePath } from "./utils/useWatchHost";

import type { musicDetail } from "./utils/musicDetail";
import { META } from "./routes/type/type";

const Audio = defineAsyncComponent(() => import("./components/player/Audio.vue"));

type linkType = "info" | "primary" | "success" | "warning" | "danger" | "default" | undefined;

const store = useStore();
const router = useRouter();
const linkType = ref<linkType>("info");
const circleRef = ref(true);

function stopLoadAudioComp() {
  const RouteRLNL = useWatchRoutePath();
  const excludeLists = ["/login", "/video", "/404"];
  const loadCompAudio = ref(true);

  watchEffect(() => {
    loadCompAudio.value = excludeLists.indexOf(RouteRLNL.value.path) > -1 ? false : true;
  });

  return loadCompAudio;
}

const loadCompAudio = stopLoadAudioComp();

function showContainerMainHidden(meta: META) {
  store.commit("setMainHidden", !!meta.mainhidden);
}

//全局路由限制
router.beforeEach(async (to, from, next) => {
  const pathList = ["/message", "/subscription"];
  const islogin = await loginStateus();
  const meta = to.meta;

  showContainerMainHidden(meta);

  const logoutnvaindex = meta.isnavindex;

  if (logoutnvaindex) {
    store.commit("setNavRouterPush", () => router.push({ path: "/index" }));
  } else {
    store.commit("setNavRouterPush", null);
  }

  if (pathList.indexOf(to.path) > -1 && !islogin) {
    // if (islogin && pathList.includes(to.path) && to.path !== "/index") {
    //   promptbox({ mountNode: "body", title: "请先登录!" });
    //   return;
    // }
    return next("/index");
  }

  if (to.path.indexOf("/login") > -1 && !islogin) {
    return next();
  } else if (to.path.indexOf("/login") > -1 && islogin) {
    return next(from.path);
  }

  const mparams = meta.params as any;
  const mquery = meta.query as any;
  const rparams = to.params as any;
  const rquery = to.query as any;

  const has = Object.prototype.hasOwnProperty;
  function everykey(querys, mquerys) {
    return mquerys.every((key) => has.call(querys, key) && querys[key] !== null);
  }

  //@ts-ignore
  const pres = typeof mparams === "undefined" ? true : everykey(rparams, mparams);
  //@ts-ignore
  const qres = typeof mquery === "undefined" ? true : everykey(rquery, mquery);

  if (pres && qres) {
    next();
  } else {
    next("/404");
  }
});

store.dispatch("countriesCode");
provide("circleRef", circleRef);

const songInfo = computed<musicDetail>(store.getters["playlist/getSongInfo"]);
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
  font-family: "ArialMT, Arial";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
