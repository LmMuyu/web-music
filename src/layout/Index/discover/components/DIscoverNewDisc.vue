<template>
  <div class="relative flost" ref="root">
    <ul
      v-for="(itemx, index) in list"
      :key="index"
      class="flex justify-around absolute top-0"
    >
      <li v-for="(listItme, i) in itemx" :key="i">
        <ElImage
          :lazy="true"
          :src="listItme?.blurPicUrl + '?param=100y100'"
          :alt="listItme?.name"
          style="height: 100px; width: 100px"
        />
      </li>
    </ul>
    <button @click="addNum" class="transform translate-y-10">点击</button>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { onMounted, watch, nextTick } from "@vue/runtime-core";
import { ElImage } from "element-plus";
import { getNewDisc } from "../../../../api/discover/getNewDisc";
// :style="[transition, { left: transitionLeft(index) }]"

const root = ref<HTMLElement | null>(null);
let list = ref<Record<string, any>[]>([]);
let leftPos = ref(0);
let silderList: HTMLElement[] = [];
let listLen = 0;
let isTran = false;
let times: NodeJS.Timeout | null = null;

watch(list.value, () => {
  listLen = list.value.length;

  nextTick(() => {
    silderList = root.value?.querySelectorAll("ul") as any;

    setTransition(leftPos.value, leftPos.value);
    setTransition(listLen - 1, leftPos.value);
    setTransition(leftPos.value + 1, leftPos.value);
  });
});

watch(leftPos, (curr) => {
  // console.log(curr);

  const par = curr === 0 ? listLen - 1 : curr - 1;
  const next = curr === listLen - 1 ? 0 : curr + 1;

  setTransition(curr, curr);
  setTransition(par, curr);
  setTransition(next, curr);
});

function setTransition(index: number, curr: number) {
  const target = silderList[index];
  target.style.transition = "left 0.5s ease";
  console.log(index, curr);

  if (index === curr) {
    target.style.left = "0px";
  } else if (index < curr) {
    target.style.left = "-500px";
  } else if (index > curr || index === 0) {
    target.style.left = "500px";
  }
}

function addNum() {
  if (isTran) return;

  isTran = true;

  leftPos.value += leftPos.value === listLen - 1 ? -(listLen - 1) : 1;

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
