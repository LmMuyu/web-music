<template>
  <ElCarousel>
    <ElCarouselItem v-for="banner in bannerData" :key="banner.encodeId">
      <div class="relative">
        <img :src="banner.imageUrl" alt="" class="w-full" />
        <span
          class="position text-xs text-white p-1 rounded-tl-md"
          :style="{ backgroundColor: banner.titleColor }"
        >
          {{ banner.typeTitle }}
        </span>
      </div>
    </ElCarouselItem>
  </ElCarousel>
</template>

<script setup lang="ts">
import { ElCarousel, ElCarouselItem } from "element-plus";
import { defineProps } from "vue";

const props = defineProps({
  bannerData: { type: Array, default: () => [] },
});
</script>

<style scoped>
.position {
  position: absolute;
  right: 0px;
  bottom: 0px;
}
</style>
