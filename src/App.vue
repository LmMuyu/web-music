<template>
  <HtmlMain />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { provide, ref } from "vue";

import routerLimit from "./common/routerLimit";

import HtmlMain from "./layout/main/Main.vue";

type linkType = "info" | "primary" | "success" | "warning" | "danger" | "default" | undefined;

const store = useStore();
const router = useRouter();

//全局路由限制
routerLimit().then((beforeRouterFn) => router.beforeEach(beforeRouterFn));

const linkType = ref<linkType>("info");
const circleRef = ref(true);

store.dispatch("countriesCode");
provide("circleRef", circleRef);
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
