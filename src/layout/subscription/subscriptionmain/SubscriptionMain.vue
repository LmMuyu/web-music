<template>
  <div class="flex items-center w-full header_h">
    <div class="w-1/2 text-2xl">
      <p>动态</p>
    </div>
    <div class="w-1/2">
      <div class="flex justify-center items-center rounded-full px-4 iconjia">
        <i class="iconfont iconlnicon34 mx-1"></i>
        <p class="h-full">写动态</p>
      </div>
    </div>
  </div>
  <SubscriptionContent />
</template>
>
<script setup lang="ts">
import SubscriptionContent from "./components/SubscriptionContent.vue";
</script>
<style scoped lang="scss">
.rounded_text {
  color: #fff;
  background: #74b9ff;
}

.iconjia {
  @include Iconfont("#fff");
}

.header_h {
  height: 44px;
}
</style>
