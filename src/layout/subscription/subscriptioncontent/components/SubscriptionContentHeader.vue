<template>
  <div class="flex w-full">
    <div class="w-1/2">动态</div>
    <div class="flex justify-center w-1/2">
      <span class="flex justify-between px-4 my-1 rounded-2xl rounded_text">
        <svg width="24" height="24" style="stroke: #fff; stroke-width: 1px">
          <rect width="3" height="12" x="12" y="5" stroke="#0984e3"></rect>
          <rect width="3" height="12" x="5" y="12" stroke="#0984e3"></rect>
        </svg>
        写动态
      </span>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.rounded_text {
  color: #fff;
  background: #74b9ff;
}
</style>
