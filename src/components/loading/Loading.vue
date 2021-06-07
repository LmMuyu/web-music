<template>
  <div
    class="
      icons
      absolute
      top-1/2
      left-1/2
      transform
      -translate-x-1/2 -translate-y-1/2
      animates
    "
  >
    <i class="iconfont iconicon_com-loading"></i>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.icons {
  @include Iconfont(#2d3436, 48);
}

.animates {
  animation: rotate 3s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
