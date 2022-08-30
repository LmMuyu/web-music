<template>
  <div style="height: 60vh; overflow: hidden" class="relative">
    <BetterScroll :openHRender="false">
      <el-row
        v-for="(tagNav, index) in filterAsideTags"
        :key="index"
        class="cursor-pointer py-4 w-full icons"
        @mouseenter="moveActive(index)"
        @mouseleave="leaveActive(index)"
        @click="toPath(tagNav.path, index)"
      >
        <el-col :span="8" class="flex items-center justify-end">
          <el-tooltip
            :visible="!windowResize"
            class="box-item"
            :content="tagNav.title"
            placement="right"
            v-if="!windowResize"
          >
            <i class="iconfont" :class="tagNav.icon" :style="activeStyle(index)"></i>
          </el-tooltip>
          <i class="iconfont" v-else :class="tagNav.icon" :style="activeStyle(index)"></i>
        </el-col>
        <el-col :span="16">
          <p v-show="windowResize" class="text-lg px-5 text_color" :style="activeStyle(index)">
            {{ tagNav.title }}
          </p>
        </el-col>
      </el-row>
    </BetterScroll>
    <div class="w-full absolute left-0 bottom-0 topshadow"></div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed, inject, Ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { currentIndex, moveIndex, AsideTags } from "../hooks/data";
import { activeIndex } from "../../../utils/activeIndex";

import { ElTooltip, ElRow, ElCol } from "element-plus";
import { useWatchRoutePath } from "../../../utils/useWatchHost";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";

const router = useRouter();
const store = useStore();
const windowResize = inject("windowResize") as Ref<boolean>;
let watchRouteStop = new Function();

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(
  currentIndex,
  moveIndex
);

const islogin = computed(() => store.getters["login/getIslogin"]);

const filterAsideTags = computed(() => {
  return islogin.value ? AsideTags : AsideTags.filter((tag) => !tag.islogin);
});

const watchRoute = useWatchRoutePath();

watchRouteStop = watchEffect(() => {
  const path = watchRoute.value.path;

  if (path !== "/") {
    const toIndex = AsideTags.findIndex((pathtag) => pathtag.path === path);
    if (toIndex != -1) {
      clickActive(toIndex);
      watchRouteStop();
    } else {
      console.error("无法找到toIndex");
    }
  }
});

const toPath = (path: string, index: number) => {
  const storedata = store.getters["login/getUserData"]();
  const islogin = store.getters["login/getIslogin"];

  clickActive(index);
  const userdata = storedata.data;

  router.push({
    path,
    query: islogin
      ? {
          uid: userdata.userID,
          isself: 1,
          issinger: "false",
        }
      : {},
  });
};

const activeTag = (to: any) => {
  currentIndex.value = AsideTags.findIndex((value) => to.path.indexOf(value.path) > -1);
};

router.beforeEach((to) => activeTag(to));
</script>
<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}

.text_color {
  color: #636e72;
}

.topshadow {
  height: 1px;
  -webkit-box-shadow: 0px -1px 5px 0px rgba(250, 250, 250, 1);
  -moz-box-shadow: 0px -1px 5px 0px rgba(250, 250, 250, 1);
  box-shadow: 0px -1px 5px 0px #d4d7de;
}
</style>
