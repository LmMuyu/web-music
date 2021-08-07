<template>
  <div class="flex justify-center items-center h-full w-full">
    <div class="w-2/5 flex justify-between items-center h-full">
      <span
        v-for="(item, index) in icons"
        class="px-4 cursor-pointer z-10"
        :key="index"
      >
        <i class="iconfont" :class="item"> </i>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const icons = ["iconpinglun", "iconfenxiang1", "iconxihuan"];
</script>
<style scoped lang="scss">
.icon {
  @include Iconfont(#f1f2f6, 20);
}
</style>
