<template>
  <CardRow :playlist="renderSongs" />
</template>
<script setup lang="ts">
import { computed, markRaw, reactive, watch } from "vue";

import CardRow from "../../../../components/card/CardRow.vue";

const props = defineProps({
  songlist: {
    type: Array,
    default: () => [],
  },
  selectTag: {
    type: String,
    default: "all",
  },
});

const songType = reactive({
  all: [],
  yesSubscribed: [],
  noSubscribed: [],
});

const renderSongs = computed(() => {
  switch (props.selectTag) {
    case "all":
      return songType.all;
    case "linke":
      return songType.noSubscribed;
    case "sub":
      return songType.yesSubscribed;
  }
});

function trnsfer(song: any) {
  return {
    id: song.id,
    path: "/home/songs",
    subtitle: "作者：" + song.creator.nickname,
    subscribed: song.subscribed,
    coverImgUrl: song.coverImgUrl,
    playCount: song.playCount,
    name: song.name,
    xsize: 225,
    ysize: 150,
  };
}

watch(props.songlist, (songs) => {
  songs.map((song: any) => {
    song = markRaw(trnsfer(song));

    if (song.subscribed === true) {
      songType.yesSubscribed.push(song);
    } else {
      songType.noSubscribed.push(song);
    }

    songType.all.push(song);
  });
});
</script>
<style scoped lang="scss"></style>
