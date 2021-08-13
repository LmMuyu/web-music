<template>
  <div class="flex items-center justify-center w-full">
    <div class="root flex pr-4 p-2 w-full rounded-lg">
      <div class="icon px-4">
        <i class="iconfont" :class="iconfont"></i>
      </div>
      <input :type="type" class="w-full input" :placeholder="placeholder" />
    </div>
  </div>
</template>
<script setup lang='ts'>

import { customRef } from "@vue/reactivity";

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


const text = (value) => customRef((track, trigger) => {
  return {
    get(getvalue) {
      track()
      return value
    },
    set(newvalue: any) {
      value = newvalue
      trigger()
      return newvalue
    }
  }
})

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