<template>
  <Main>
    <router-view v-slot="{ Component, route }">
      <keep-alive v-if="route.meta.KeepAlive">
        <component :is="Component" />
      </keep-alive>

      <component :is="Component" v-else />
    </router-view>
  </Main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { useStore } from "vuex";

import { searchDefault } from "./api/app/searchDefault";

import Main from "./layout/main/Main.vue";

import type { UserInfo } from "./store/type";

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
store.commit("setLocalStorage");

const header = reactive({
  searchDefault: null,
});

const userInfo = ref<UserInfo | null>(null);
const showTag = ref(false);
const linkType = ref<linkType>("info");

async function search() {
  const { data: defData } = await searchDefault({ url: "/search/default" });
  header.searchDefault = defData.data;
}

search();

router.beforeEach((to, from, next) => {
  const meta = to.meta;

  if (meta.hasOwnProperty("showTag")) {
    showTag.value = meta.showTag as boolean;
  }

  next();
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
  font-family: "微软雅黑", simsun, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
