<template>
  <div class="search_bar w-64 bg-white absolute top-20 left-0 z-50">
    <div class="text-black p-3 search_user">
      <router-link
        :to="{
          path: '/search',
          query: {
            text: 'dawd',
            type: 1002,
          },
        }"
      >
        搜索"{{ keyword }}"相关用户</router-link
      >
    </div>
    <!-- <div>
      <div v-for="(type, index) in renderData" :key="index">
        <div class="text-black p-2 buttom_line">{{ type }}</div>
        <ul class="list-none text_color py-2 buttom_line">
          <li
            v-for="(musicItem, index) in renderData"
            :key="index"
            class="overflow-hidden whitespace-nowrap overflow-ellipsis"
          >
            {{ musicItem }}
          </li>
        </ul>
        <div></div>
      </div>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-dom";

const props = defineProps({
  keyword: {
    type: String,
    required: true,
  },
  renderData: {
    type: Array,
    required: true,
  },
});
</script>
<style lang="scss">
@mixin buttomLine($backgroundColor) {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: inherit;
  height: 2px;
  background: $backgroundColor;
}

.search_bar {
  box-shadow: 0 4px 7px #555;
}

.text_color {
  color: #555;
}

.search_user {
  position: relative;
  &::after {
    @include buttomLine(rgba(239, 68, 68));
  }
}

.buttom_line {
  position: relative;
  &::after {
    @include buttomLine(#888);
  }
}
</style>
