<template>
  <ElCarousel>
    <ElCarouselItem v-for="banner in bannerData" :key="banner.encodeId" class="relative">
      <img :src="banner.imageUrl" alt="" class="w-full h-full object-cover" />
      <span
        class="position text-xs text-white p-1 rounded-tl-md"
        :style="{ backgroundColor: banner.titleColor }"
      >
        {{ banner.typeTitle }}
      </span>
      <router-link
        class="absolute left-0 top-0 w-full h-full z-10"
        :to="{ path: '/playlist', query: { id: banner.targetId } }"
        v-if="!banner.url"
      ></router-link>
      <a
        v-else
        :href="banner.url"
        class="absolute left-0 top-0 w-full h-full z-10"
        target="_blank"
      ></a>
    </ElCarouselItem>
  </ElCarousel>
</template>

<script setup lang="ts">
import { defineProps, nextTick, onMounted } from "vue";

import { ElCarousel, ElCarouselItem } from "element-plus";

import type { PropType } from "vue";

const props = defineProps({
  bannerData: { type: Array as PropType<any[]>, default: () => [] },
});

onMounted(() => {
  nextTick().then(() => {
    const buttonList = document.querySelectorAll(".el-carousel__arrow");
    const carousel = document.querySelector(".el-carousel__indicators");

    if (buttonList && buttonList.length >= 1) {
      buttonList.forEach((v) => {
        const btn = v as HTMLElement;
        btn.style.outline = "none";
        btn.style.zIndex = "9";
      });
    }

    if (carousel) {
      const tracks = carousel as HTMLElement;
      tracks.style.display = "flex";
      tracks.style.zIndex = "9";
    }
  });
});
</script>

<style scoped>
.position {
  position: absolute;
  right: 0px;
  bottom: 0px;
}
</style>
