<template>
  <section class="footer_heigth flex w-full h-full">
    <div class="w-3/4 h-full"></div>
    <div class="flex justify-between items-center w-1/4 h-full">
      <i> {{ likedCount === 0 ? "" : likedCount }} </i>
      <span>转发</span>
      <span>分享</span>
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
