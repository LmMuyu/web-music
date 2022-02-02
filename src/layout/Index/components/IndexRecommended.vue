<template>
  <div class="py-4">
    <span class="text-2xl" style="color: #7474ad">推荐</span>
  </div>
  <div>
    <div class="flex overflow-hidden relative" style="width: 370px; height: 206px">
      <svg
        class="z-10"
        xmlns="http://www.w3.org/2000/svg"
        width="370"
        height="206"
        viewBox="0 0 370 206"
      >
        <path
          id="Rectangle_3_copy"
          data-name="Rectangle 3 copy"
          d="M5,0H365a5,5,0,0,1,5,5V201a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V5A5,5,0,0,1,5,0Z"
          fill="rgba(57,7,120,0.77)"
        />
      </svg>
      <div class="absolute top-0 left-0 w-full h-full">
        <img
          id="Layer_3"
          data-name="Layer 3"
          width="388"
          height="248"
          src="../../../assets/下载.png"
        />
      </div>
      <div class="text-white absolute top-0 left-0">
        <span>热门</span>
        <span>单曲</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { getRecommend } from "../../../api/index";

const recommendSongs = ref([]);
recommendSongs.value = (await getRecommend()).data.result;
</script>
<style scoped lang="scss"></style>
