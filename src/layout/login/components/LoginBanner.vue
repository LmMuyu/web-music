<template>
  <ul class="flex w-full h-full absolute right-0 top-0 bottom-0 overflow-hidden">
    <li class="w-full h-full" v-for="(img, index) in banners" :key="index">
      <img class="w-full h-full object-contain" :src="img.imageUrl" />
    </li>
  </ul>
</template>
<script setup lang='ts'>
import { ref } from "@vue/reactivity";

import { getBannerImg } from "../../../api/login";

const banners = ref([])

getBannerImg().then(({ data }) => banners.value = data.banners.slice(0, 4))
</script>
<style scoped lang='scss'>
</style>