<template>
  <section class="icon absolute top-0 bottom-0 h-full w-full overflow-hidden">
    <button
      class="iconfont icondel absolute top-0 left-0"
      @click="unmount"
    ></button>
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
      <!-- <img :src="imgList[currentIndex]?.['pcSquareUrl'] ?? ''" /> -->
    </main>
    <footer style="height: 10%"></footer>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "@vue/runtime-core";

import { useThemeColor } from "./hooks/useThemeColor";

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
    type: Function as PropType<(payload: any) => void>,
  },
});

const currentIndex = ref(0);

const bgcolor = computed(async () => {
  const src = props.imgList[currentIndex.value]?.["pcSquareUrl"] ?? "";
  return await useThemeColor(src);
});

watch(
  () => bgcolor,
  (value) => {
    console.log(value);
  },
  {
    deep: true,
  }
);
</script>
<style scoped lang="scss">
.icon {
  @include Iconfont(#0033ff, 20);
}

.margin_auto {
  margin: 0 auto;
}
</style>
