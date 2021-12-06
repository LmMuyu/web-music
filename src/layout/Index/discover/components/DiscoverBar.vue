<template>
  <div class="mx-8">
    <div class="relative border_bar">
      <span v-html="useHeaderTile('推荐歌手')"> </span>
    </div>
    <div>
      <ul class="list-none relative">
        <li
          class="flex items-center h-12 my-3"
          v-for="artistsItem in renderList"
          :key="artistsItem.id"
        >
          <div class="w-1/4 flex items-center">
            <span
              class="w-auto h-auto flex items-center justify-center bg-gray-200"
              style="border-radius: 50%"
            >
              <img
                v-lazy="artistsItem.picUrl + '?param=48y48'"
                class="object-cover w-12 h-12"
                style="border-radius: 100%"
              />
            </span>
          </div>
          <div class="h-full w-2/4">
            <span>{{ artistsItem.name }}</span>
          </div>
          <div class="w-1/4 h-full">
            <button
              style="background-color: #74b9ff; color: #2d3436"
              class="h-10 w-full cursor-pointer text-lg"
            >
              关注
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";

import { getArtists } from "../../../../api/discover";
import useHeaderTile from "../hooks/useHeaderTile";

const renderList = ref<any>([]);

getArtists().then(({ data }) => (renderList.value = data.artists));
</script>
<style scoped lang="scss">
.border_bar {
  &::after {
    content: "";
    display: block;
    border-bottom: 1px solid #636e7266;
  }
}
</style>
