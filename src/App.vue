<template>
  <GridBar
    :listData="list"
    :turnonSlot="true"
    :styleRow="[styleRow.backgroundColor._object]"
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
            <p :style="styleRow.color._object">
              {{ tag.text }}
            </p>
          </router-link>
        </li>
      </ul>
    </template>

    <template v-slot:slot_right>
      <GridBar :sizeSpan="[12, 12]" :styleRow="styleRow.height._object">
        <template v-slot:slot_0>
          <IndexSearch :placeholder="header?.searchDefault?.showKeyword" />
        </template>

        <template v-slot:slot_1>
          <div class="rounded-2xl h-full flex justify-center items-center">
            <ElLink
              href="javscript:;;"
              :type="linkType"
              class="text_in text-white align-middle"
              style="color: #787878"
              @click="onLogin"
            >
              登录
            </ElLink>
          </div>
        </template>
      </GridBar>
    </template>
  </GridBar>

  <router-view v-slot="{ Component }">
    <keep-alive exclude="">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { computed, reactive, ref, toRefs } from "vue";
import GridBar from "/comps/gridBar/GridBar.vue";
import IndexSearch from "/comps/search/Search.vue";
import { searchDefault } from "./api/app/searchDefault";
import { ElLink } from "element-plus";
import { list } from "./headerList";
import router from "./routes";

import loginApp from "./view/login/login";

const header = reactive({
  searchDefault: null,
});

const showTag = ref(false);
const linkType = ref("info");

router.beforeEach((to, from, next) => {
  const meta = to.meta;

  if (meta.hasOwnProperty("showTag")) {
    showTag.value = showTag;
  }

  next();
});

const styles = reactive({
  backgroundColor: "rgb(51, 51, 51, 1)",
  color: "rgb(204,204,204,1)",
  height: "100%",
});

const gridWidth = computed(() => {
  for (const value of list) {
    if (value.hasOwnProperty("tags")) {
      return 100 / value.tags.length + "%";
    }
  }
});

const styleRow = { ...toRefs(styles) };

async function search() {
  const { data: defData } = await searchDefault({ url: "/search/default" });
  header.searchDefault = defData.data;
}
search();

function onLogin() {
  const loginInstance = loginApp({
    el: "#login",
  });

  loginInstance.show();
}
</script>

<style lang="scss">
@import "./css/normalize.css";

@include Iconfont(red, 32);

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
