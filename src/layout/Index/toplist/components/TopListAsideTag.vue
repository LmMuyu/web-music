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
import { listTitle } from "../hooks/data";

import TopListAsideTagItem from "./TopListAsideTagItem.vue";
</script>
<style scoped lang="scss"></style>
