<template>
  <HtmlMain />
  <div class="absolute bottom-0 left-0 w-full" v-if="loadCompAudio">
    <Audio :songinfo="songInfo" />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import routerLimit from "./common/routerLimit";

import Audio from "./components/player/Audio.vue";
import HtmlMain from "./layout/main/Main.vue";

import type { musicDetail } from "./utils/musicDetail";
import { useWatchRoutePath } from "./utils/useWatchHost";

type linkType = "info" | "primary" | "success" | "warning" | "danger" | "default" | undefined;

const store = useStore();
const router = useRouter();

function stopLoadAudioComp() {
  const RouteRLNL = useWatchRoutePath();

  const loadCompAudio = computed(() => {
    return RouteRLNL.value.path.indexOf("/login") > -1 ? false : true;
  });

  return loadCompAudio;
}

const loadCompAudio = stopLoadAudioComp();

const globalBeforeRouters = [routerLimit];

//全局路由限制
router.beforeEach(async (to, from, next) => {
  for (const globalRouterFunction of globalBeforeRouters) {
    const fu = await globalRouterFunction();
    fu(to, from, next);
  }
});

const linkType = ref<linkType>("info");
const circleRef = ref(true);

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
