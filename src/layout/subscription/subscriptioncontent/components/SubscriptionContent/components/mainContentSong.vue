<template>
  <section class="w-full h-12 my-6 flex items-center">
    <div class="w-12 h-full">
      <img :src="musicDetail.picUrl" class="object-cover" alt="" />
    </div>
    <div class="flex flex-col justify-around ml-4">
      <router-link
        style="color: #74b9ff"
        :to="{ path: '/playlist', query: { id: musicDetail.id } }"
        target="_blank"
      >
        {{ musicDetail.name }}
      </router-link>
      <router-link
        style="color: #74b9ff"
        v-for="singerInfo in musicDetail.singerInfo"
        :key="singerInfo.id"
        :to="{ path: '/user/home', query: { uid: singerInfo.id } }"
      >
        {{ singerInfo.name }}
      </router-link>
    </div>
  </section>
</template>
<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  musicDetail: {
    type: Object,
    default: () => ({}),
  },
});
</script>
<style scoped lang="scss"></style>
