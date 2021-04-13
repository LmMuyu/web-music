<template>
  <div class="inline-flex justify-between ml-6 mr-6 bottom_line">
    <p class="text-left text-xl">热门主播</p>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.bottom_line {
  position: relative;
  width: calc(100% - 24px - 24px);
  ::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    display: block;
    border: 1px solid #ecf0f1;
  }
}
</style>
