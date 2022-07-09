<template>
  <HeadTitle title="推荐" />
  <div class="flex justify-between">
    <div
      v-for="(hotsong, index) in recommendSongs"
      :key="index"
      class="flex overflow-hidden relative w-80 h-44 rounded-md"
    >
      <router-link :to="{ path: '/songdetail', query: { id: hotsong.id } }">
        <div
          class="absolute top-0 left-0 w-full h-full"
          style="background: rgba(57, 7, 120, 0.77)"
        ></div>
        <div class="rounded-md">
          <img :src="hotsong.picUrl" alt="" />
        </div>
        <div class="text-white absolute top-8 left-4 flex flex-col">
          <span class="text-2xl"> {{ hotsong.name }} </span>
          <span class="pt-4" style="color: #d5b9fa"> 歌单 </span>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { getRecommend } from "../../../api/index";
import HeadTitle from "./IndexModuleHeadTitle.vue";

const recommendSongs = ref([]);

getRecommend(3).then((res) => {
  recommendSongs.value = res.data.result;
});
</script>
<style scoped lang="scss"></style>
