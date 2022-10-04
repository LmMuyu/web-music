<template>
  <font-icon
    @click="pageRouterGo('prev')"
    size="20"
    icon="iconarrow-right-copy"
    class="px-2"
    :color="stackRoute.length == 1 ? '#E6E8EB' : '#607d8b'"
  ></font-icon>
  <font-icon
    @click="pageRouterGo('next')"
    size="20"
    icon="iconmore"
    class="p-2"
    :color="stackRoute.length == 1 && !firstinit ? '#E6E8EB' : '#607d8b'"
  ></font-icon>
</template>
<script setup lang="ts">
import { nextTick, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useWatchRoutePath } from "../../../utils/useWatchHost";

import FontIcon from "../../fonticon/FontIcon.vue";

const router = useRouter();

const stackRoute = ref([]);

let go: "next" | "prev" = null;

function pageRouterGo(behavior: "prev" | "next") {
  go = behavior;
  if (behavior === "prev" && stackRoute.value.length === 1) return;

  router.go(behavior == "next" ? 1 : -1);
}

const firstinit = ref(true);

function StackRoutes(to: any) {
  const isReplace = !!to.params?.isReplace;

  if (isReplace) {
    console.log(`路由地址${to.path}是通过replace方法调用的`);
    firstinit.value = true;
  } else {
    if (go && go === "next") {
      stackRoute.value.push(to.path);
    } else if (go) {
      stackRoute.value.pop();
    } else {
      const onepath = stackRoute.value.pop();
      const twopath = stackRoute.value.pop();

      if (!!onepath && !!twopath) {
        if (twopath === to.path) {
          stackRoute.value.push(twopath);
        } else {
          stackRoute.value.push(onepath, twopath, to.path);
        }
      } else if (onepath && !twopath) {
        stackRoute.value.push(onepath, to.path);
      }
    }

    firstinit.value = false;
    go = null;
  }
}

const stop = useWatchRoutePath(async (to) => {
  if (!firstinit.value) {
    StackRoutes(to);
  }

  await nextTick();
  if (firstinit.value) {
    let path = getPrevSessionRoutePath();
    path = path === "" ? [to.path] : path;

    stackRoute.value.push(...path);
    firstinit.value = false;
  }
  console.log(stackRoute.value);
});

window.onbeforeunload = function () {
  const routepath = stackRoute.value.join(",");
  sessionStorage.setItem("routepath", routepath);
};

function getPrevSessionRoutePath() {
  const routepath = sessionStorage.getItem("routepath");

  return routepath ? routepath.split(",") : "";
}

onUnmounted(() => {
  stop();
});
</script>
<style lang="scss" scoped></style>
