<template>
  <div class="flex justify-center items-center h-full">
    <span class="icon_text">
      <i class="iconfont iconsousuo bg-white py-2 px-1 rounded-l-lg"></i>
    </span>
    <input
      :type="type"
      class="text-black w-48 py-2 px-2 border-none outline-none rounded-r-lg"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
});
</script>

<style scoped lang="scss">
@include Iconfont(rgb(204, 204, 204, 1));

.icon_text {
  transform: translateX(1px);
}
</style>
