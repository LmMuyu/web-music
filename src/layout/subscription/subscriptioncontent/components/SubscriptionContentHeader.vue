<template>
  <div class="flex w-full header_h">
    <div class="w-1/2 text-2xl">
      <p>动态</p>
    </div>
    <div class="w-1/2">
      <div class="flex justify-center items-center">
        <span
          class="
            rounded_text
            icon
            flex
            items-center
            justify-center
            px-4
            rounded-full
          "
        >
          <i class="iconfont iconlnicon34 mx-1"></i>
          <p class="h-full">写动态</p>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.rounded_text {
  color: #fff;
  background: #74b9ff;
}

.icon {
  @include Iconfont("#2d3436");
}

.header_h {
  height: 44px;
}
</style>
