<template>
  <section class="footer_heigth flex w-full h-full">
    <div class="w-1/2 h-full"></div>
    <div class="flex justify-end items-center w-1/2 h-full">
      <span class="flex justify-center items-center px-4">
        <i></i>
        <p>{{ likedCount === 0 ? "" : `(${likedCount})` }}</p>
      </span>
      <span class="flex justify-center items-center px-4">
        <p>转发</p>
        <p>{{ likedCount === 0 ? "" : `(${likedCount})` }}</p>
      </span>
      <span class="flex justify-center items-center px-4">
        <p>分享</p>
        <p>{{ likedCount === 0 ? "" : `(${likedCount})` }}</p>
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
const props = defineProps({
  likedCount: {
    type: Number,
    default: 0,
  },
});
</script>
<style scoped lang="scss">
.footer_heigth {
  height: 60px;
}
</style>
