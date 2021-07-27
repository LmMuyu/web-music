<template>
  <div class="h-full w-full flex items-center">
    <div
      class="h-4/5 w-full p-2 rounded-md flex outline border_style"
      type="text"
      contenteditable
      @input="onInput"
    >
      <div class="w-full" ref="writebox">
        <p class="w-3/4" v-text="defaultText"></p>
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
import { onMounted, nextTick } from "@vue/runtime-core";

const defaultText = ref("a");
const writebox = ref<HTMLElement | null>(null);
const writeBoxHeight = ref(0);

const onInput = (e) => {
  console.log(e);
};

document.addEventListener("keydown", (e) => {
  if (e.isComposing) {
    if (e.key === "enter") {
      const childrenNodeList = writebox.value.children;
    }

    if (e.key === "Backspace") {
    }
  }
});

onMounted(() => {
  nextTick(() => {
    // writeBoxHeight.value = writebox.value
    //   .getBoundingClientRect()
    //   .height.toFixed(2);
  });
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
