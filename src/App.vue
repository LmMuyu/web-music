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
import { computed, reactive, ref } from "vue";

import router from "./routes";
import { useStore } from "vuex";
import { list } from "./headerList";
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
store.dispatch("countriesCode");

const header = reactive({
  searchDefault: null,
});

const userInfo = ref<UserInfo | null>(null);
const showTag = ref(false);
const linkType = ref<linkType>("info");

const styles = reactive({
  backgroundColor: "rgb(51, 51, 51, 1)",
  color: "rgb(204,204,204,1)",
  height: "100%",
});

const gridWidth = computed(() => {
  for (const value of list) {
    if (value.hasOwnProperty("tags")) {
      return 100 / value.tags!.length + "%";
    }
  }
});

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
