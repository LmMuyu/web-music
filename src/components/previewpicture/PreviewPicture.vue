<template>
  <section
    style="background-color:rgba(91, 112, 131, 0.4)"
    class="icon root absolute top-0 bottom-0 h-full w-full overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 w-full h-full opacity-60"
      :style="{ backgroundColor: styleColor ?? '#fff' }"
    ></div>
    <div class="absolute top-0 left-0 m-2" style="z-index:10">
      <i class="iconfont icondel cursor-pointer close delete_btn" @click="unmount"></i>
    </div>

    <main
      class="margin_auto relative flex items-center justify-center overflow-hidden z-10 opacity-100"
      ref="main"
      style="height: 90%"
    >
      <DirectionIndicator :isIfBtnArr="isIfBtn" @switchPicture="switchImage" />
      <div :style="imageInfo" class="z-10">
        <img
          class="object-cover"
          :style="{ width: imageInfo.maxWidth, height: imageInfo.maxHeight }"
          :src="listview[currentIndex]?.['originUrl'] ?? ''"
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
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  unref,
  watch,
} from "@vue/runtime-core";

import { returnThemmColor } from "./hooks/useThemeColor";

import DirectionIndicator from "./components/DirectionIndicator.vue";
import PreviewFooter from "./components/Footer.vue";

import type { PropType } from "vue";
import type { globalRefType } from "../../type";

getCurrentInstance().appContext.config.globalProperties.listViewPipe = listViewPipe

const props = defineProps({
  previewList: {
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

const currentIndex = ref(parseInt(props.index));
const listview = ref(props.previewList);

const footer = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);

const imageMaxInfo = reactive({
  widthMax: 0,
  heightMax: 0,
});

const { stopEffect, styleColor, setsrcpipe } = returnThemmColor(
  listview.value[currentIndex.value]?.["originUrl"] ?? "",
  {
    width: listview.value[currentIndex.value]?.["width"] ?? 0,
    height: listview.value[currentIndex.value]?.["height"] ?? 0,
  }
);



function listViewPipe(data: globalRefType<any>) {
  listview.value = []//清除数组

  const newData = unref(data)
  listview.value.push(...newData)
}

function switchImage(direction: "prev" | "next") {
  if (direction === "prev" && currentIndex.value !== 0) {
    currentIndex.value -= 1
  } else if (direction === "next" && currentIndex.value !== listview.value.length - 1) {
    currentIndex.value += 1
  }

}

//索引变动时，图片也要变动
watch(currentIndex, (value) => {
  setsrcpipe.value = listview.value[value]?.["originUrl"] ?? ""
})

const imageInfo = computed(() => {
  return {
    maxWidth: imageMaxInfo.widthMax + "px",
    maxHeight: imageMaxInfo.heightMax + "px",
  };
});

const isIfBtn = computed(() => {
  const len = listview.value.length
  const index = Number(unref(currentIndex.value))
  const ifarr: [boolean, boolean] = [false, false]

  if (len === 1) return ifarr

  ifarr[0] = index - 1 < 0 ? false : true
  ifarr[1] = index + 1 > len - 1 ? false : true

  return ifarr
})



onMounted(() => {
  nextTick().then(() => {
    const bodyHegiht = document.documentElement.offsetHeight;
    const offsetHeight = footer.value.offsetHeight;

    const offsetWidth = main.value.offsetWidth * 0.77;

    imageMaxInfo.heightMax = bodyHegiht - offsetHeight;
    imageMaxInfo.widthMax = offsetWidth;
  });
});


onUnmounted(() => {
  stopEffect?.()
})

</script>
<style scoped lang="scss">
.root {
  &:nth-child(1) {
    .delete_btn {
      border-radius: 50%;
      outline: none;
    }
  }
}

.icon {
  @include Iconfont(#fff, 16);

  .close {
    font-size: 32px !important;
  }
}

.margin_auto {
  margin: 0 auto;
}
</style>
