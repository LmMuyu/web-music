<template>
  <textarea class="h-24 w-full text-base bg-white resize-none content" v-model="modeltext"></textarea>
</template>
<script setup lang='ts'>
import { customRef } from "@vue/reactivity";

const modeltext = (function (value = "4444") {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newvlaue: string) {
        value = newvlaue
        trigger()
      }
    }
  })
})()
</script>
<style scoped lang='scss'>
.content {
  outline: none;
  border: 1px solid #636e72;
}

.content::-webkit-scrollbar-button {
  display: none;
}
</style>