<template>
  <div class="icon w-full h-full absolute top-0 bottom-0">
    <div
      style="width: 5%;"
      class="h-full absolute top-0 left-0 flex justify-center items-center"
      v-if="isIfBtnArr[0]"
    >
      <button
        class="iconfont iconarrow-right-copy before outline"
        @click="ctxEmit('switchPicture', 'prev')"
      ></button>
    </div>
    <div
      style="width: 5%;"
      class="h-full absolute top-0 right-0 flex justify-center items-center"
      v-if="isIfBtnArr[1]"
    >
      <button class="iconfont iconmore after outline" @click="ctxEmit('switchPicture', 'next')"></button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineEmit } from "@vue/runtime-core";

import type { PropType } from "vue"


const ctxEmit = defineEmit(["switchPicture"])

const props = defineProps({
  isIfBtnArr: {
    type: Array as unknown as PropType<[boolean, boolean]>,
    default: () => ([])
  }
})

</script>
<style scoped lang="scss">
.icon {
  @include Iconfont(#fff, 18);

  .before {
    font-size: 26px !important;
  }
  .after {
    font-size: 26px !important;
  }
}
.outline {
  outline: none;
  border: none;
}
</style>
