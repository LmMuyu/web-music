<template>
  <div class="h-full">
    <div v-if="showTags" class="float-left w-1/5 h-full right_border">
      <div class="pl-14 h-full">
        <IndexAsideTags />
      </div>
    </div>
    <div
      class="overflow-hidden h-full"
      :class="[showTags ? 'w-4/5' : 'w-full']"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import router from "../../routes";
import IndexAsideTags from "./component/IndexAsideTags.vue";

const showTags = ref(true);

router.beforeResolve((to, from, next) => {
  const isShow = to.meta.showTags as boolean | undefined;
  showTags.value = typeof isShow === "undefined" ? true : isShow;
  next();
});
</script>

<style scoped lang="scss">
.right_border {
  border-right: 1px solid rgb(99, 110, 114, 0.4);
}
</style>
