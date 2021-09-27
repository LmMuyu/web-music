<template>
  <nav>
    <span
      v-for="(tagNav, index) in AsideTags"
      :key="index"
      class="flex items-center cursor-pointer py-4 icons"
      @mouseenter="moveActive(index)"
      @mouseleave="leaveActive(index)"
      @click="toPath(tagNav.path, index)"
    >
      <i class="iconfont" :class="tagNav.icon" :style="activeStyle(index)"></i>
      <p class="text-2xl px-5 text_color" :style="activeStyle(index)">
        {{ tagNav.title }}
      </p>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { currentIndex, moveIndex, AsideTags } from "../hooks/data";
import { activeIndex } from "../../../utils/activeIndex";

const router = useRouter();
const store = useStore();

const pathlist = inject("pathlist") as string[];

const toPath = (path: string, index: number) => {
  const islogin = store.getters;

  if (!islogin && pathlist.indexOf(path) > -1) {
    router.push({ path: "/login" });
    return;
  }

  clickActive(index);
  router.push({ path });
};

const activeTag = (to: any) => {
  currentIndex.value =
    AsideTags.findIndex((value) => value.path === to.path) ?? 0;
};

router.beforeEach((to) => activeTag(to));

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
