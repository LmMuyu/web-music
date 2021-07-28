<template>
  <div class="h-full w-full flex items-center">
    <div
      class="w-full p-2 rounded-md flex outline border_style"
      style="height: 80%"
      type="text"
      contenteditable
      @input="onInput"
    >
      <div
        class="w-full"
        :class="colunm === 3 && 'overflow-auto'"
        ref="writebox"
      >
        <p v-text="defaultText"></p>
      </div>
      <div
        class="h-full w-1/4 flex items-center"
        :contenteditable="false"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";

import { size } from "../hook/data";

const defaultText = ref("a");
const writebox = ref<HTMLElement | null>(null);
const writeBoxHeight = ref(0);

const colunm = ref(0);

let initBoxHeight = false;

const onInput = (e) => {
  if (!initBoxHeight) {
    writeBoxHeight.value = Number(
      writebox.value.getBoundingClientRect().height.toFixed(2)
    );

    initBoxHeight = true;
  }
};

document.addEventListener("keydown", (e) => {
  if (!e.isComposing) {
    const colunmSize = writebox.value.childNodes.length + 1;

    if (e.key === "Enter") {
      colunm.value = colunmSize;

      if (colunm.value === 3) {
        size.value += 20;
      }
    }

    if (e.key === "Backspace") {
      colunm.value = colunmSize;

      if (colunm.value == 2) {
        size.value -= 20;
      }
    }
  }
});
</script>
<style scoped lang="scss">
.border_style {
  background-color: #f5f7f9;
}

.outline {
  outline: none;
}

.margin_auto {
  margin: auto 0;
}
</style>
