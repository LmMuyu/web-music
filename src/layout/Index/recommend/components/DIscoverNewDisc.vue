<template>
  <header>
    <div class="flex items-center py-3">
      <div
        class="
          div_yuan
          w-5
          h-5
          bg-red-500
          relative
          flex
          items-center
          justify-center
        "
      >
        <div class="div_yuan w-2 h-2 bg-white"></div>
      </div>
      <p class="text-2xl ml-4">新碟上映</p>
    </div>
    <div class="w-full h-1 bg-red-500"></div>
  </header>

  <article
    class="
      flex
      items-center
      justify-center
      border-2 border-solid border-gray-200
      p-8
      mt-6
    "
    style="background: #f5f5f5"
  >
    <div class="icons cursor-pointer" @click="leftNum">
      <i class="iconfont iconarrow-right-copy"></i>
    </div>
    <div
      class="relative overflow-x-hidden flost w-full"
      ref="root"
      style="height: 100px"
    >
      <ul
        v-for="(itemx, index) in list"
        :key="index"
        class="flex justify-around absolute top-0 h-full"
        style="width: 500px"
      >
        <li v-for="(listItme, i) in itemx" :key="i" class="ml-4">
          <div>
            <img
              :src="listItme?.blurPicUrl + '?param=100y100'"
              :alt="listItme?.name"
              style="width: 100px; height: 100px"
              class="box-content"
            />
            <a href=""></a>
            <a href="javascript:;;">
              <i></i>
            </a>
          </div>
        </li>
      </ul>
    </div>
    <div class="icons cursor-pointer" @click="rightNum">
      <i class="iconfont iconmore"></i>
    </div>
  </article>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { watch, nextTick } from "@vue/runtime-core";
import { getNewDisc } from "../../../../api/discover/getNewDisc";
import { POSITION } from "../type";

const root = ref<HTMLElement | null>(null);
const list = ref<Record<string, any>[]>([]);
let silderList: HTMLElement[] = [];

const currentIndex = ref(0);
let listLen = 0;
let isTran = false;

let times: NodeJS.Timeout | null = null;

function runTransition(fnc: any[]) {
  const createPromise = (fn: Function) =>
    new Promise((resolve) => {
      resolve(fn());
    });

  Promise.all(fnc.map((fn: Function) => createPromise(fn)));
}

watch(list.value, () => {
  listLen = list.value.length;

  nextTick(() => {
    silderList = root.value?.querySelectorAll("ul") as any;

    setTransition(currentIndex.value, "curr");
    setTransition(listLen - 1, "pre");
    setTransition(currentIndex.value + 1, "next");
  });
});

watch(currentIndex, (curr) => {
  const pre = curr === 0 ? listLen - 1 : curr - 1;
  const next = curr === listLen - 1 ? 0 : curr + 1;

  setTransition(curr, "curr");
  setTransition(pre, "pre");
  setTransition(next, "next");
});

function setTransition(index: number, position: string) {
  if (!position) return;
  position = position.trim();

  const target = silderList[index];
  target.style.zIndex = "0";
  switch (position) {
    case POSITION.CURR:
      target.style.transition = "left 0.5s ease";
      target.style.left = "0px";
      target.style.zIndex = "99";
      break;
    case POSITION.PRE:
      target.style.transition = "left 0.5s ease";
      target.style.left = "-500px";
      break;
    case POSITION.NEXT:
      target.style.transition = "left 0.5s ease";
      target.style.left = "500px";
      break;
  }
}

function leftNum() {
  if (isTran) return;

  isTran = true;

  currentIndex.value += currentIndex.value === 0 ? listLen - 1 : -1;

  times = setTimeout(() => {
    isTran = false;
    restoreTranOption();
  }, 1017);
}

function rightNum() {
  if (isTran) return;

  isTran = true;

  currentIndex.value += currentIndex.value === listLen - 1 ? -(listLen - 1) : 1;

  times = setTimeout(() => {
    isTran = false;
    restoreTranOption();
  }, 1017);
}

function restoreTranOption() {
  clearTimeout(times!);
  times = null;
}

getNewDisc({
  url: "/top/album",
  params: {
    limit: "20",
    offset: 0,
    area: "ZH",
    type: "hot",
  },
}).then((res) => list.value.push(...res));
</script>
<style lang="scss" scoped>
.icons {
  @include Iconfont(#333, 18);
}

.flost {
  ::before,
  ::after {
    content: "";
    display: table;
  }
  ::after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
</style>
