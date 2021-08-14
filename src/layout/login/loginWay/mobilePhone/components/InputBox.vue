<template>
  <div class="flex items-center justify-center w-full">
    <div class="root flex pr-4 p-2 w-full rounded-lg">
      <div class="icon px-4">
        <i class="iconfont" :class="iconfont"></i>
      </div>
      <input :type="type" v-model="text" class="w-full input" :placeholder="placeholder" />
    </div>
  </div>
</template>
<script setup lang='ts'>
import { customRef } from "@vue/reactivity";

import type { Ref } from "vue"

const props = defineProps({
  type: {
    type: String,
    default: "text"
  },
  iconfont: {
    type: String,
    default: 'iconwode'
  },
  placeholder: {
    type: String,
    default: ""
  }
})


const text = (function (value: number | string, delay = 150) {
  let timeout

  return customRef((track, tigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
          console.log(newValue);
          timeout = null
          tigger()
        }, delay)
      }
    }
  })
})("444") as Ref<string>

</script>
<style scoped lang='scss'>
.root {
  border: 1px solid #b2bec3;
}

.input {
  outline: none;
}

.icon {
  @include Iconfont(#2d3436, 20);
}
</style>