<template>
  <ul class="list-none" v-for="navItem in listTitle" :key="navItem.index">
    <li>
      <div class="py-6 text-xl">{{ navItem.title }}</div>
      <nav class="shadow pb-7">
        <TopListAsideTagItem :nav-item="navItem" />
      </nav>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { onBeforeUnmount, watchEffect } from "@vue/runtime-core";
import { listTitle } from "../hooks/data";

import TopListAsideTagItem from "./TopListAsideTagItem.vue";

const watchStop = watchEffect(() => {
  let index = 0;

  for (const key in listTitle) {
    if (Object.prototype.hasOwnProperty.call(listTitle, key)) {
      // @ts-ignore
      const list: any[] = listTitle[key].childrenData;
      const resList = list.map((v) => ({ keyIndex: index++, ...v }));
      // @ts-ignore
      listTitle[key].childrenData = resList;
    }
  }
});

onBeforeUnmount(() => {
  watchStop();
});
</script>
<style scoped lang="scss"></style>
