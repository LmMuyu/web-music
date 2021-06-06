<template>
  <div class="h-full">
    <div class="float-left w-1/5 h-full right_border">
      <div class="pl-14 h-full">
        <IndexAsideTags />
      </div>
    </div>
    <div class="overflow-hidden w-4/5 h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import IndexAsideTags from "./component/IndexAsideTags.vue";
</script>

<style scoped lang="scss">
.right_border{
  border-right: 1px solid rgb(99, 110, 114,0.4);
}
</style>
