<template>
  <div class="border_bar flex py-3">
    <div
      :style="{ width: setWidth(0) }"
      class="flex items-center translate-x-4"
    >
      <span class="cursor-default font_size">热门推荐</span>
    </div>
    <div :style="{ width: setWidth(1) }">
      <ul class="list-none flex items-center h-full">
        <p>类别：</p>
        <li
          v-for="(tag, index) in hotName"
          :key="`tag_${tag.id}`"
          class="text-sm text-gray-500"
          :class="{
            'px-4': index >= 1,
            'pr-4': index == 0,
          }"
          :style="{
            color: curindex === index ? '#74b9ff' : '',
          }"
          @mouseenter="curindex = index"
          @mouseleave="curindex = index"
        >
          <router-link :to="`/index/recommend?hotname=${tag.name}`">{{
            tag.name
          }}</router-link>
        </li>
      </ul>
    </div>
    <div :style="{ width: setWidth(2) }">
      <p
        class="
          flex
          items-center
          justify-end
          h-full
          text-black
          transform
          -translate-x-4
          cursor-pointer
          icon
        "
      >
        更多
        <i class="iconfont iconup-copy-copy"></i>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";

const props = defineProps({
  categoryname: {
    type: Array,
    required: true,
  },
});

const curindex = ref(0);

const sizeSpan = [4, 14, 6];
const size = 4.166;

const hotName = computed<any[]>(() => props.categoryname.slice(0, 5));
const setWidth = computed(() => {
  return (position: number) => size * sizeSpan[position] + "%";
});
</script>

<style lang="scss">
.icon {
  @include Iconfont(#74b9ff);
}

.border_bar {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 2px;
    background-color: #74b9ff;
  }
}

.font_size {
  font-size: 21px;
}

.text_shadow {
  box-shadow: 0 10px 40px -10px rgba(0, 64, 128, 0.2);
}
</style>
