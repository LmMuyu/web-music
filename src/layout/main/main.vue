<template>
  <div class="flex h-full">
    <div v-if="showTags" class="float-left w-1/5 h-full right_border">
      <div class="pl-14 h-full" :style="{ minHeight: minheight + 'px' }">
        <IndexAsideTags />
      </div>
    </div>
    <div
      class="overflow-hidden h-full"
      :class="[showTags ? 'w-4/5' : 'w-full']"
      :style="{ minWidth: minwidth + 'px' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

import IndexAsideTags from "./component/MainAsideTags.vue";
import { useMinWh } from "./hooks/useMinWH";

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
</style>
