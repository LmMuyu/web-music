<template>
  <div class="icons w-full h-full flex justify-center items-center">
    <i class="iconfont iconicon_com-loading w-auto h-auto animates"></i>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.icons {
  @include Iconfont(#0984e3, 32);
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

.clearfix:before,
.clearfix:after {
  display: table;
  content: ""; /*不用有内容也可以*/
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}
</style>
