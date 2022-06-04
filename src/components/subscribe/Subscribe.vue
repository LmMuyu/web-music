<script setup lang="ts">
import { ElButton } from "element-plus";

const ctxEmit = defineEmits(["follow"]);

const props = defineProps({
  subscribe: {
    type: Boolean,
    required: true,
  },
  authorid: {
    type: Number,
    required: true,
  },
  class: String,
});
</script>
<template>
  <div :class="class" class="px-4">
    <el-button
      @click="ctxEmit('follow', [props.subscribe ? 1 : 0, props.authorid])"
      size="small"
      :type="subscribe ? 'primary' : 'danger'"
    >
      {{ subscribe ? "已订阅" : "订阅" }}
    </el-button>
  </div>
</template>
<style scoped lang="scss"></style>
