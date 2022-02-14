<template>
  <HeadTitle title="发现" />
  <div class="flex">
    <div
      v-for="(types, index) in discoverTypeLists"
      :key="index"
      :style="setLinearGradient(index)"
      class="w-56 h-24"
      :class="margin_right(index + 1)"
    >
      <span class="text-white text-xl w-full h-full flex justify-center items-center">
        {{ types.name }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { margin_right } from "../hook";

import HeadTitle from "./IndexModuleHeadTitle.vue";

const discoverTypeLists = ref([
  {
    name: "歌手",
    type: 1,
  },
  {
    name: "歌单",
    type: 2,
  },
  {
    name: "话题",
    type: 3,
  },
  {
    name: "视频",
    type: 4,
  },
]);

const linearGradient: Record<
  number,
  {
    pos: string;
    colors: string[];
  }
> = {
  0: {
    pos: "to right",
    colors: ["#4facfe", "#00f2fe"],
  },
  1: {
    pos: "to right",
    colors: ["#FF867A 0%", "#FF8C7F 20%", "#F99185 60%", "#CF556C 80%", "#B12A5B 100%"],
  },
  2: {
    pos: "to right",
    colors: ["#667EEA", "#764BA2"],
  },
  3: {
    pos: "to right",
    colors: ["#FF758C", "#FF7EB3"],
  },
};

function setLinearGradient(pos: number) {
  const posinfo = linearGradient[pos];
  if (posinfo) {
    return {
      backgroundImage: `linear-gradient(${posinfo.pos}, ${posinfo.colors.join(",")})`,
    };
  }
}


</script>
<style scoped lang="scss">
.xianxjianbian {
  background-image: linear-gradient(to right, #4facfe, #00f2fe);
}
</style>
