<template>
  <section class="icon h-full w-full relative overflow-hidden">
    <button class="iconfont icondel absolute top-0 left-0"></button>
    <button
      class="
        iconfont
        iconarrow-right-copy
        absolute
        top-1/2
        left-0
        transform
        -translate-y-1/2
      "
    ></button>
    <button
      class="
        iconfont
        iconmore
        absolute
        top-0
        left-1/2
        transform
        -translate-y-1/2
      "
    ></button>
    <main class="margin_auto" style="height: 90%">
      <!-- <img :src="imgList[currentIndex]['pcSquareUrl'] ?? ''" /> -->
    4444
    </main>
    <footer style="height: 10%"></footer>
  </section>
</template>
<script setup lang="ts">
import { ref } from "@vue/runtime-core";

import type { PropType } from "vue";

const props = defineProps({
  imgList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  unmount: {
    type: Function,
  },
});

const currentIndex = ref(0);
</script>
<style scoped lang="scss">
.icon {
  @include Iconfont(#f5f6fa, 20);
}

.margin_auto {
  margin: 0 auto;
}
</style>
