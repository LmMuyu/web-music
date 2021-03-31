<template>
  <div class="flex py-3">
    <div
      :style="{ width: setWidth(0) }"
      class="flex items-center translate-x-4"
    >
      <div
        class="div_yuan w-5 h-5 bg-red-500 relative flex items-center justify-center"
      >
        <div class="div_yuan w-2 h-2 bg-white"></div>
      </div>
      <span class="text-2xl translate-x-3">热门推荐</span>
    </div>
    <div :style="{ width: setWidth(1) }">
      <ul class="list-none flex items-center h-full w-80">
        <li
          v-for="(tag, index) in hotName"
          :key="`tag_${tag.id}`"
          class="flex justify-between px-2 text-gray-500"
          style="width: 20%"
        >
          <a href="javascript:void(0)">{{ tag.name }}</a>
          <span v-if="index + 1 != hotName.length" class="text-gray-500"
            >|</span
          >
        </li>
      </ul>
    </div>
    <div :style="{ width: setWidth(2) }">
      <p
        class="flex items-center justify-end h-full text-black transform -translate-x-4 icon"
      >
        更多
        <i class="iconfont iconup-copy-copy"></i>
      </p>
    </div>
  </div>
  <div class="w-full h-1 bg-red-500"></div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps({
  categoryname: {
    type: Array,
    required: true,
  },
});

const sizeSpan = [4, 14, 6];
const size = 4.166;

const hotName = computed(() => props.categoryname.slice(0, 5));
const setWidth = computed(() => {
  return (position: number) => size * sizeSpan[position] + "%";
});
</script>

<style lang="scss">
.icon {
  @include Iconfont(rgba(255, 0, 0, 0.815));
}
.div_yuan {
  border-radius: 50%;
}
</style>
