<template>
  <div class="flex flex-col">
    <ul
      class="list-none border-t border-solid border-gray-200 overflow-y-hidden"
      :style="{ height: eachColH + 'px' }"
      v-for="(renderItem, index) in renderList"
      :key="index"
    >
      <li class="flex justify-center p-2">
        <span class="w-1/2 text-lg">{{ titleMap.get(renderItem.title) }}</span>
        <router-link :to="{ path: '/searchresult' }" class="w-1/2 text-right"
          >查看更多</router-link
        >
      </li>
      <li
        class="h-2/6 py-1 px-2"
        v-for="(renderChild, indexID) in renderItem.render"
        :key="indexID"
      >
        <router-link
          :to="{ path: '/playList', query: { id: renderChild.id } }"
          tag="a"
          target="_blank"
        >
          <span>{{
            renderName(renderChild.singerInfo) + "——" + renderChild.name
          }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from "@vue/runtime-core";

import { mainContent, titleMap } from "../hooks/data";
import { musicDetail } from "../../../../utils/musicDetail";
import { mainContentHeight, resultOptions } from "../hooks/methods";

const props = defineProps({
  musicList: {
    type: Array,
    default: () => [],
  },
  keyword: {
    type: String,
  },
});

const eachColH = ref(0);

const renderList = computed(() => {
  const mapBack = (v: Record<string, any>) =>
    new musicDetail(new resultOptions(v));

  return props.musicList.map((item: any) => {
    const key = item.type + "s";
    return {
      title: item.type,
      render: (item[key] as Array<Record<string, any>>).map(mapBack),
    };
  });
});

const renderName = computed(() => {
  return function (list: any) {
    return list.map((v: { name: string }) => v.name).join("/");
  };
});

const column = computed(() => props.musicList.length);

onMounted(() => {
  mainContentHeight(mainContent, column, eachColH);
});
</script>
<style scoped lang="scss"></style>
