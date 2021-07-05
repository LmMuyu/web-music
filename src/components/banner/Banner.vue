<template>
  <ElCarousel>
    <ElCarouselItem
      v-for="banner in bannerData"
      :key="banner.encodeId"
      class="relative"
    >
      <img :src="banner.imageUrl" alt="" class="w-full h-full object-cover" />
      <span
        class="position text-xs text-white p-1 rounded-tl-md"
        :style="{ backgroundColor: banner.titleColor }"
      >
        {{ banner.typeTitle }}
      </span>
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
      buttonList.forEach((v) => ((v as HTMLElement).style.outline = "none"));
    }

    if (carousel) {
      (carousel as HTMLElement).style.display = "flex";
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
