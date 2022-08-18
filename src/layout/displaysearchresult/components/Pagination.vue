<template>
  <div class="w-full flex justify-center">
    <ElPagination
      background
      layout="prev, pager,  next"
      :page-size="count"
      :total="total"
      @current-change="(page) => ctxEmit('currpage', page)"
    ></ElPagination>
  </div>
</template>
<script setup lang="ts">
import { ElPagination } from "element-plus";

const ctxEmit = defineEmits(["currpage"]);

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});


</script>
<style scoped lang="scss"></style>
