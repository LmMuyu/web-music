<template>
  <section
    class="icon absolute top-0 bottom-0 h-full w-full overflow-hidden"
    :style="{ backgroundColor: styleColor }"
  >
    <div class="absolute top-0 bottom-0 w-full h-full opacity-50"></div>

    <button
      class="iconfont icondel absolute top-0 left-0 close"
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
        before
      "
    ></button>
    <button
      class="
        iconfont
        iconmore
        absolute
        top-1/2
        right-0
        transform
        -translate-y-1/2
        after
      "
    ></button>
    <main
      class="
        margin_auto
        flex
        items-center
        justify-center
        overflow-hidden
        z-10
        opacity-100
      "
      ref="main"
      style="height: 90%"
    >
      <div :style="imageInfo">
        <img
          class="object-cover"
          :src="imgList[currentIndex]?.['originUrl'] ?? ''"
        />
      </div>
    </main>
    <footer style="height: 10%" class="w-full" ref="footer">
      <PreviewFooter />
    </footer>
  </section>
</template>
<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  watchEffect,
} from "@vue/runtime-core";

import { returnThemmColor } from "./hooks/useThemeColor";
import PreviewFooter from "./components/Footer.vue";

import type { PropType } from "vue";

const props = defineProps({
  imgList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  index: {
    type: String,
    default: 0,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  unmount: {
    type: Function as PropType<(payload: any) => void>,
  },
});

const currentIndex = ref(props.index);
const footer = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);

const imageMaxInfo = reactive({
  widthMax: 0,
  heightMax: 0,
});

const imageInfo = computed(() => {
  return {
    maxWidth: imageMaxInfo.widthMax + "px",
    maxHeight: imageMaxInfo.heightMax + "px",
  };
});

const whInfo = computed(() => {
  return function (widthMax: number, heightMax: number) {
    const info = JSON.parse(JSON.stringify(props.imgList[currentIndex.value]));
    console.log(info);

    if (info.width > widthMax) {
      info.width = widthMax;
    }

    if (info.height > heightMax) {
      info.height = heightMax;
    }

    return {
      width: info.width,
      height: info.height,
    };
  };
});

const { stopEffect, styleColor, setsrcpipe } = returnThemmColor(
  props.imgList[currentIndex.value]?.["originUrl"] ?? "",
  whInfo.value(imageMaxInfo.widthMax, imageMaxInfo.heightMax)
);

watchEffect(() => {
  console.log(whInfo.value(imageMaxInfo.widthMax, imageMaxInfo.heightMax));
});

onMounted(() => {
  nextTick().then(() => {
    const bodyHegiht = document.documentElement.offsetHeight;
    const offsetHeight = footer.value.offsetHeight;

    const offsetWidth = main.value.offsetWidth * 0.77;

    imageMaxInfo.heightMax = bodyHegiht - offsetHeight;
    imageMaxInfo.widthMax = offsetWidth;
  });
});
</script>
<style scoped lang="scss">
.icon {
  @include Iconfont(#d8dadb, 20);

  .close {
    font-size: 42px !important;
  }

  .before {
    font-size: 28px !important;
  }
  .after {
    font-size: 28px !important;
  }
}

.margin_auto {
  margin: 0 auto;
}
</style>
