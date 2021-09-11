<template>
  <div class="flex h-full">
    <div v-if="showTags" class="float-left w-1/5 h-full right_border">
      <div class="h-full" :style="{ minHeight: minheight + 'px' }">
        <IndexAsideTags />
      </div>
    </div>
    <div
      class="overflow-hidden h-full relative"
      :class="[showTags ? 'w-4/5' : 'w-full']"
      :style="{ minWidth: minwidth + 'px' }"
    >
      <slot></slot>
      <div class="golbalmark"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

import { useMinWh } from "./hooks/useMinWH";

import IndexAsideTags from "./component/MainAsideTags.vue";

const showTags = ref(true);

useRouter().beforeEach((to) => {
  const isShow = to.meta.showTags as boolean | undefined;
  showTags.value = typeof isShow === "undefined" ? true : isShow;
});

const { minwidth, minheight } = useMinWh();
</script>

<style scoped lang="scss">
.right_border {
  border-right: 1px solid #f5f6fa;
}

.min-h-w {
  min-height: 620px;
}

.golbalmark {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: #fff;
}
</style>
