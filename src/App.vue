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
          <div class="relative flex items-start flex-col h-full w-full">
            <!-- <Search
              @change="onSearch"
              @focus="onSearch"
              @blur="onBlur"
              :returnresdata="returnResData"
              :placeholder="header?.searchDefault?.showKeyword"
            />
            <SearchShowTheBar
              :renderData="showTheBar.renderData"
              :keyword="showTheBar.keyword"
              v-if="showTheBar.showBar"
            /> -->

             
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

<script setup lang="ts">
import SearchShowTheBar from "/comps/search/components/SearchShowTheBar.vue";
import { onSearch } from "./components/search/api/onSearch";
import { searchDefault } from "./api/app/searchDefault";
import { computed, getCurrentInstance, reactive, ref, toRefs } from "vue";
import GridBar from "/comps/gridBar/GridBar.vue";
import Search from "/comps/search/Search.vue";
import onLogin from "./view/login/login";
import { ElLink } from "element-plus";
import { list } from "./headerList";
import router from "./routes";

const ctx = getCurrentInstance()!;
ctx.appContext.config.globalProperties.store.dispatch("countriesCode");


const header = reactive({
  searchDefault: null,
});

const showTag = ref(false);
const linkType = ref("info");
const showTheBar = reactive<{
  showBar: boolean;
  keyword: string;
  renderData: Record<string, any>[];
}>({
  showBar: false,
  keyword: "",
  renderData: [],
});

const styles = reactive({
  backgroundColor: "rgb(51, 51, 51, 1)",
  color: "rgb(204,204,204,1)",
  height: "100%",
});

const styleRow = { ...toRefs(styles) };

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

const showBar = (show: boolean, keyword: string = "") => {
  if (showTheBar.showBar && keyword !== "") return;

  showTheBar.showBar = show;
};

function returnResData(keyword: string, data: Record<string, any>[]) {
  showTheBar.keyword = keyword;
  showTheBar.renderData = data;

  setTimeout(() => {
    showBar(!showTheBar.showBar, keyword);
  });
  // console.log(data);
}

function onBlur(blur: boolean) {
  blur = blur ? blur : false;
  showBar(blur);
}

router.beforeEach((to, from, next) => {
  const meta = to.meta;

  if (meta.hasOwnProperty("showTag")) {
    showTag.value = meta.showTag as boolean;
  }

  next();
});
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
