<template>
  <section class="footer_heigth flex w-full h-full">
    <div class="w-1/2 h-full"></div>
    <div class="flex justify-end items-center w-1/2 h-full">
      <span
        class="flex justify-center items-center px-4 cursor-pointer icons"
        @click="onLinke"
      >
        <i class="iconfont icondianzan1"></i>
        <p style="color: #b2bec3" class="text-sm">
          {{ likedCount === 0 ? "" : `(${likedCount})` }}
        </p>
      </span>
      <span class="flex justify-center items-center px-4 cursor-pointer">
        <p>转发</p>
        <p style="color: #b2bec3" class="text-sm">
          {{ likedCount === 0 ? "" : `(${likedCount})` }}
        </p>
      </span>
      <span class="flex justify-center items-center px-4 cursor-pointer">
        <p>分享</p>
        <p style="color: #b2bec3" class="text-sm">
          {{ likedCount === 0 ? "" : `(${likedCount})` }}
        </p>
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
import { defineEmit } from "vue";

const ctxEmit = defineEmit(["linke"]);

const props = defineProps({
  likedCount: {
    type: Number,
    default: 0,
  },
});

const onLinke = () => ctxEmit("linke");
</script>
<style scoped lang="scss">
.footer_heigth {
  height: 60px;
}

.icons {
  @include Iconfont(#74b9ff, 18);
}
</style>
