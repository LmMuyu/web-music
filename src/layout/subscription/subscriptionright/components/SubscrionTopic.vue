<template>
  <span class="py-4">
    <p>热门话题</p>
  </span>
  <nav ref="nav">
    <span>
      <p></p>
    </span>
  </nav>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { getTopic } from "../../../../api/subscription";

const nav = ref<HTMLElement | null>(null);

function Image() {}

let topicList: HTMLElement[];

getTopic().then((topic) => {
  const hotlist = topic.data.hot;

  topicList = hotlist.map((topicinfo) => {});
});
</script>
<style scoped lang="scss"></style>
