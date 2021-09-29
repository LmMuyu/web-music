<template>
  <div
    contenteditable="true"
    style="color: #2d3436"
    class="w-full h-20 overflow-y-auto content"
    @input="modelText"
  ></div>
  <div class="w-full py-2 flex items-center">
    <div class="w-full flex items-center">
      <span class="px-2 cursor-pointer">@</span>
      <span class="px-2 cursor-pointer">表情</span>
    </div>
    <div class="flex items-center">
      <p class="flex justify-end px-2">{{ currlen }}/150</p>
      <ElButton
        class="w-20"
        type="primary"
        @click="ctxEmit('sendComment', data)"
        >发送</ElButton
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";

import { ElButton } from "element-plus";

const ctxEmit = defineEmits(["sendComment"]);

let currlen = ref(0);
let data = "";

function modelText(e: InputEvent) {
  if (currlen.value >= 150) return;
  const text = e.data;

  if (text == null) {
    data = data.substring(0, data.length - 1);
    currlen.value -= 1;
  } else {
    data += text;
    currlen.value += 1;
  }
}
</script>
<style scoped lang="scss">
.content {
  outline: none;
  border: 1px solid #636e72;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #484848;
  }
}
</style>
