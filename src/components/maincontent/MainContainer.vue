<template>
  <div class="flex h-full w-full" style="background: hsl(220, 50%, 98%)">
    <div v-if="isDefault" class="w-full">
      <el-container v-if="isLoginComp" class="h-full relative">
        <el-main
          class="h-full absolute top-0 left-0 right-0"
          :style="paddingStyle()"
          style="z-index: 1"
        >
          <router-view v-slot="{ Component }">
            <keep-alive :max="3">
              <component :is="Component"></component>
            </keep-alive>
          </router-view>
        </el-main>
        <div class="absolute top-0 left-0 w-full h-5 bg-white z-10"></div>
        <div class="absolute top-5 left-0 bg-white w-5 h-10 z-10"></div>
        <div class="absolute top-5 right-0 bg-white w-5 h-10 z-10"></div>
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
        :style="{ width: settConInfo.left.width }"
        class="relative"
      >
        <el-main
          v-if="shieldContainer(settConInfo.left?.center)"
          class="h-full absolute top-0 left-0 right-0 track_bar"
        >
          <router-view name="section" v-slot="{ Component }">
            <keep-alive>
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
        <el-main v-if="shieldContainer(settConInfo.right?.center)" class="text w-full track_bar">
          <router-view name="article" v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"></component>
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { reactive, ref } from "vue";

import { useWatchHost } from "../../utils/useWatchHost";

import { ElContainer, ElMain } from "element-plus";

import type { Container, META } from "../../routes/type/type";

const router = useRouter();
const route = useRoute();

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

const isLoginComp = useWatchHost();

function paddingStyle() {
  const value = route.meta.padding;

  return value === "none"
    ? {
        padding: 0,
      }
    : typeof value === "string"
    ? {
        padding: value,
      }
    : value;
}

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

const returnresdata = (any: any) => {
  console.log(any);
};

const shieldContainer = computed(() => {
  return function (state: boolean) {
    return state + "" === "false" ? state : true;
  };
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
