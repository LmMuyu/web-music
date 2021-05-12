<template>
  <div class="flex">
    <div class="w-1/2"></div>
    <div class="w-1/2 flex justify-center sliderTrack">
      <div>
        <p
          class="p-2"
          v-for="musicItem in musicItemList"
          :key="musicItem.playTime"
          :class="{ 'text-blue-400': musicItem.playItem === playItem }"
        >
          {{ musicItem.lycnode }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";

import { getLyrics } from "../../../api/playList";
import { conversionPlayTime } from "../hooks/methods";

const music = useRoute().query.id as string;
const musicItemList = ref<any>([]);
const playItem = ref(0);

getLyrics(music).then(({ data }) => {
  const lyrics = data.lrc.lyric as string;
  const lrcReg = /\[(?<playTime>.+)\]\s?(?<lyc>.+)/g;

  const iterator = lyrics.matchAll(lrcReg);
  let value = true;

  while (value) {
    const matchItem = iterator.next().value;
    if (!matchItem) {
      value = false;
      break;
    }

    musicItemList.value.push(conversionPlayTime(matchItem.groups));
  }

  console.log(musicItemList.value);
});
</script>
<style scoped lang="scss">
.sliderTrack::-webkit-scrollbar {
  display: none;
}
</style>
