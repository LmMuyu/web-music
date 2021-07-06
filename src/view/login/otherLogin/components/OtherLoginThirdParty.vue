<template>
  <ul class="flex flex-col items-center list-noneh-full icon">
    <li
      v-for="(other, index) in thirdPartyLogin"
      :key="index"
      class="flex items-center justify-center min-w-full pt-6 cursor-pointer"
    >
      <div
        class="
          flex
          items-center
          justify-center
          border-solid border border-gray-400
          w-12
          h-12
          round
        "
      >
        <i
          class="iconfont"
          :class="other.icon"
          :style="{ color: other.color, fontSize: other.size }"
        ></i>
      </div>
      <p class="transform translate-x-6">{{ other.text + "登录" }}</p>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";

import type { thridparty } from "../api/data";
import type { PropType } from "vue";

const props = defineProps({
  thirdPartyLogin: {
    type: Array as PropType<thridparty[]>,
    default: () => [],
  },
});
</script>
<style scoped lang="scss"></style>
