<template>
  <div class="flex">
    <div class="w-1/2"></div>
    <div class="w-1/2"></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";

import { getLyrics } from "../../../api/playList";

const music = useRoute().query.id as string;

getLyrics(music).then(({ data }) => {
  // const lyrics = data.lrc.lyric as string;
  // const lrcReg = /(\[.+\])\s?(.+)/gm;
  // console.log(lyrics);

  // console.log(lyrics.match(lrcReg));
});
</script>
<style scoped lang="scss"></style>
