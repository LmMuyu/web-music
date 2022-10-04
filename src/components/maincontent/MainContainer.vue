<template>
  <el-skeleton style="height: 100vh" :loading="skeleton" animated>
    <template #default>
      <div class="flex h-full w-full" style="background: #e5e7eb">
        <div v-if="isDefault" class="w-full">
          <el-container v-if="isLoginComp" class="h-full">
            <el-header height="60" class="bg-white mx-5 flex items-center py-2">
              <GroupFontIcon />
            </el-header>
            <el-main
              style="z-index: 1; padding-top: 0px; padding-bottom: 0px"
              :style="{
                overflow: hidden ? 'hidden' : 'auto',
                height: containerHeight,
              }"
            >
              <router-view v-slot="{ Component }">
                <keep-alive :max="3" :exclude="['Playlist', 'Searchres']">
                  <component :is="Component"></component>
                </keep-alive>
              </router-view>
            </el-main>
          </el-container>
          <div class="w-full h-full" v-else>
            <router-view v-slot="{ Component }">
              <component :is="Component"></component>
            </router-view>
          </div>
        </div>

        <div v-else class="w-full flex">
          <el-container
            v-if="shieldContainer(settConInfo.left?.subject)"
            :style="{ width: settConInfo.left.width, height: '100vh' }"
            class="relative"
          >
            <el-header height="60" class="bg-white mx-5 flex items-center py-2">
              <GroupFontIcon />
            </el-header>
            <el-main
              v-if="shieldContainer(settConInfo.left?.center)"
              class="h-full absolute top-0 left-0 right-0 track_bar"
            >
              <router-view name="section" v-slot="{ Component }">
                <keep-alive :exclude="['Playlist', 'Searchres']">
                  <component :is="Component"></component>
                </keep-alive>
              </router-view>
            </el-main>
          </el-container>
          <el-container
            v-if="shieldContainer(settConInfo.right?.subject)"
            class="border-l border-solid"
            :style="{ width: settConInfo.right.width }"
          >
            <el-header height="60" class="bg-white mx-5 flex items-center">
              <GroupFontIcon />
            </el-header>
            <el-main
              v-if="shieldContainer(settConInfo.right?.center)"
              class="text w-full track_bar"
            >
              <router-view name="article" v-slot="{ Component }">
                <keep-alive :exclude="['Playlist', 'Searchres']">
                  <component :is="Component"></component>
                </keep-alive>
              </router-view>
            </el-main>
          </el-container>
        </div>
      </div>
    </template>
    <template #template>
      <WebsiteInitLoading />
    </template>
  </el-skeleton>
</template>
<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { useStore } from "vuex";

import { useWatchHost } from "../../utils/useWatchHost";

import { ElContainer, ElMain, ElHeader, ElSkeleton } from "element-plus";
import WebsiteInitLoading from "./components/WebsiteInitLoading.vue";
import GroupFontIcon from "./components/GroupFontIcon.vue";

import type { Container, META } from "../../routes/type/type";

type keyroutestack<T extends string = "prev" | "next"> = `${T}RouteStack`;

const router = useRouter();
const store = useStore();

let iniRouterResolve = false;
const skeleton = ref(true);
const isDefault = ref(false);

const settConInfo = reactive<{
  left: Container;
  right: Container;
}>({
  left: {
    width: null,
  },
  right: {
    width: null,
  },
});

function storeRouteStack(
  behavior: "get",
  key: keyroutestack,
  data?: string[]
): string[];
function storeRouteStack(
  behavior: "set",
  key: keyroutestack,
  data: string[]
): string[];
function storeRouteStack(
  behavior: "set" | "get",
  key: keyroutestack,
  data: string[]
): string[] {
  const m = `${behavior}Item`;
  const d = sessionStorage[m](key, data && data.join(",")) as string;

  return d ? d.split(",") : [];
}

const isLoginComp = useWatchHost();

router.beforeEach((to) => {
  const matched = to.matched;
  //@ts-ignore
  const defaultComp = matched[0]?.components.default ?? undefined;

  if (defaultComp) {
    isDefault.value = true;
  } else {
    isDefault.value = false;
  }
});

window.onbeforeunload = function () {
  //@ts-ignore
  storeRouteStack("set", "nextRouteStack", [...nextRouteStack]);
  //@ts-ignore
  storeRouteStack("set", "prevRouteStack", [...prevRouteStack]);
};

const shieldContainer = computed(() => {
  return function (state: boolean) {
    return state + "" === "false" ? state : true;
  };
});

const hidden = computed(store.getters["getMainHidden"]);

const containerHeight = computed(() => window.innerHeight + "px");

router.beforeResolve((to) => {
  if (!isDefault.value) {
    const meta: META = to.meta;
    const posinfo = meta?.setting || { left: {}, right: {} };

    const settingWidth = function (posos: Container, posstr: string) {
      return posos["width"]
        ? posos["width"] * 10 + "%"
        : (posstr.trim() === "left" ? 66.666 : 33.333) + "%";
    };

    Object.keys(posinfo).forEach((pos) => {
      const width = settingWidth(posinfo[pos], pos);

      settConInfo[pos] = { ...posinfo[pos], width };
    });
  }
});

router.beforeResolve((to) => {
  if (!iniRouterResolve) {
    iniRouterResolve = true;
    skeleton.value = false;
  }
});
</script>

<style scoped lang="scss">
.track_bar::-webkit-scrollbar {
  display: none;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: ""; /*不用有内容也可以*/
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}
</style>
