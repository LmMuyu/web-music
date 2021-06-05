<template>
  <!-- <GridBar
    :listData="list"
    :turnonSlot="true"
    :styleRow="{ backgroundColor: styles.backgroundColor }"
    :class="['py-3']"
    :sizeSpan="[6, 12, 6]"
    v-if="!showTag"
  >
    <template v-slot:slot_left="{ item: handerLeft }">
      <div class="flex items-center justify-center">
        <i class="iconfont rounded" :class="handerLeft.icon"></i>
        <p class="text-2xl text-white mx-3">
          {{ handerLeft.text }}
        </p>
      </div>
    </template>

    <template v-slot:slot_center="{ item: handerCenter }">
      <ul class="grid_ul h-full w-full list-none text-xl flex items-center">
        <li v-for="(tag, index) in handerCenter.tags" :key="index">
          <router-link :to="tag.path">
            <p :style="{ color: styles.color }">
              {{ tag.text }}
            </p>
          </router-link>
        </li>
      </ul>
    </template>

    <template v-slot:slot_right>
      <GridBar :sizeSpan="[12, 12]" :styleRow="{ height: styles.height }">
        <template v-slot:slot_0>
          <div
            class="
              relative
              flex
              items-start
              justify-center
              flex-col
              h-full
              w-full
            "
          >
            <button
              class="
                appicon
                text-lg
                outline-none
                border-none
                flex
                justify-center
                items-cneter
              "
              :style="{ color: styles.color }"
              @click="mountApp"
            >
              <i class="iconfont iconsousuo1"></i>
              <span class="px-1"> 点击搜索 </span>
            </button>
          </div>
        </template>

        <template v-slot:slot_1>
          <div class="rounded-2xl h-full flex justify-center items-center">
            <ElLink
              href="#"
              :type="linkType"
              class="text_in text-white align-middle"
              style="color: #787878"
              @click="onLogin('#login')"
              v-if="!userInfo"
            >
              登录
            </ElLink>
            <ShowUserInfo :userInfo="userInfo" v-else />
          </div>
        </template>
      </GridBar>
    </template>
  </GridBar> -->
  <router-view v-slot="{ Component, route }">
    <keep-alive v-if="route.meta.KeepAlive">
      <component :is="Component" />
    </keep-alive>

    <component :is="Component" v-else />
  </router-view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import router from "./routes";
import { useStore } from "vuex";
import { list } from "./headerList";
import onLogin from "./view/login/login";
import { searchDefault } from "./api/app/searchDefault";
import { mountApp } from "./layout/Index/search/app";

import { ElLink } from "element-plus";
import GridBar from "/comps/gridBar/GridBar.vue";
import ShowUserInfo from "/layout/Index/showUserInfo/ShowUserInfo.vue";

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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
