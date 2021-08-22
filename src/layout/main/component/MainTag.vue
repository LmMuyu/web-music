<template>
  <nav>
    <ul class="list-none">
      <li
        class="flex items-center cursor-pointer py-4 icons"
        v-for="(tag, index) in AsideTags"
        :key="tag.index"
        @mouseenter="moveActive(index)"
        @mouseleave="leaveActive(index)"
        @click="
        clickActive(index);
        toPath(tag.path);
        "
      >
        <i class="iconfont" :class="[tag.icon]" :style="activeStyle(index)"></i>
        <a class="text-2xl px-5 text_color" :style="activeStyle(index)">
          {{
            tag.title
          }}
        </a>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

import { currentIndex, moveIndex, AsideTags } from "../hooks/data";

import { activeIndex } from "../../../utils/activeIndex";

const router = useRouter();
const toPath = (path: string) => router.push({ path });

const activeTag = (to: any) => {
  currentIndex.value =
    AsideTags.value.findIndex((value) => value.path === to.path) ?? 0
}


router.beforeEach((to) => activeTag(to));
// router.afterEach((to) => {

//   console.log(to);
//   console.log(router.currentRoute.value);
// })

const { activeStyle, clickActive, moveActive, leaveActive } = new activeIndex(
  currentIndex,
  moveIndex
);
</script>
<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}

.text_color {
  color: #636e72;
}
</style>
