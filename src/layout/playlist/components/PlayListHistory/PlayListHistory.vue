<template>
  <ElDrawer
    @closed="onClosed"
    :showClose="false"
    :withHeader="false"
    :modelValue="isopen"
    :size="containerWidth"
  >
    <ElContainer class="relative w-full h-full">
      <ElHeader height="56" class="flex justify-between">
        <div>
          <span class="text-base">{{ title }}</span>
        </div>
        <div>
          <el-button size="small" @click="showDialog">发表评论</el-button>
          <Dialog ref="dialog" />
        </div>
      </ElHeader>
      <el-main v-if="loading" class="w-full h-full flex justify-center items-center">
        <loading></loading>
      </el-main>
      <el-main v-else class="relative h-full parser">
        <BetterScroll class="absolute top-0 left-0 w-full h-full">
          <component
            v-for="(item, index) in data"
            :key="index"
            :scopedData="item"
            :is="compId"
          ></component>
        </BetterScroll>
      </el-main>
      <ElFooter v-if="showfooter" class="flex items-start">
        <el-pagination
          ref="paging"
          v-model:currentPage="curPage"
          @current-change="on['current-change']"
          @next-click="on['next-click']"
          @prev-click="on['prev-click']"
          :page-size="size"
          :pager-count="11"
          layout="prev, pager, next"
          :total="total"
          class="flex justify-center"
        ></el-pagination>
      </ElFooter>
    </ElContainer>
  </ElDrawer>
</template>
<script setup lang="ts">
import { defineProps, shallowRef, watch, watchEffect } from "@vue/runtime-core";
import { computed, isRef, nextTick, onMounted, onUnmounted, PropType, ref } from "vue";

import {
  ElDrawer,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElPagination,
  ElButton,
} from "element-plus";
import BetterScroll from "../../../../components/betterscroll/BetterScroll.vue";
import Dialog from "./components/Dialog.vue";
import Loading from "../../../../components/svgloading/SvgLoading.vue";
import HistoryItem from "./components/HistoryItem.vue";
import CommentItem from "./components/CommentItem";

import type { Include } from "./type";

const props = defineProps({
  title: {
    type: String,
    default: "历史记录",
  },
  record: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({
      allData: [],
      isopen: false,
    }),
  },
  on: {
    type: Object as PropType<
      Include<typeof ElPagination, "prev-click" | "next-click" | "current-change">
    >,
    default: () => ({
      "prev-click": () => {},
      "next-click": () => {},
      "current-change": () => {},
    }),
  },
  size: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  unmountApp: Function,
});

const curPage = ref(1);
const paging = ref<typeof ElPagination | null>(null);
const showfooter = ref(false);
const loading = ref(true);
const compId = shallowRef<typeof HistoryItem | typeof CommentItem>(CommentItem);
const dialog = ref(null);

//@ts-ignore
const data = computed(() => props.record.allData?.value ?? props.record.allData);

const isopen = computed(() => isRef(props.record.isopen));
const onClosed = () => props.unmountApp();

const ishistory = computed(() => props.title === "历史记录");
const containerWidth = computed(() => (ishistory.value ? "25%" : "50%"));

function showFooterRef() {
  if (!showfooter.value) {
    showfooter.value = true;
  } else {
    showfooter.value = false;
  }
}

showFooterRef();

let muObserve: MutationObserver | null;

function setPagerClass() {
  const el = paging.value.$el as HTMLElement;
  if (!el) {
    return;
  }

  const elpager = el.children[1];

  const btnPrevClass = "el-icon more btn-quickprev";
  const btnNextClass = "el-icon more btn-quicknext";

  function getMutainerNode(dom) {
    let isMutationRecord = dom instanceof MutationRecord;
    let strClass: string = "";
    let node: HTMLElement | null = null;

    if (isMutationRecord) {
      const MR = dom as MutationRecord;
      const len = MR.addedNodes.length;

      if (len > 0) {
        node = MR.addedNodes[0] as HTMLElement;
        strClass = node.classList.value;
      }
    } else {
      strClass = dom.classList.value;
      node = dom;
    }

    return {
      strClass,
      node,
    };
  }

  function setFlexClass(list: Element[] | MutationRecord[]) {
    list.forEach((dom) => {
      const { node, strClass } = getMutainerNode(dom);

      if (btnNextClass === strClass || btnPrevClass === strClass) {
        node.style.cssText = `
            display:inline-flex !important
          `;
        node.className += " items-center justify-center";
      }
    });
  }

  setFlexClass(Array.from(elpager.children));

  muObserve = new MutationObserver((mutaions) => {
    setFlexClass(mutaions);
  });

  muObserve.observe(elpager, {
    childList: true,
  });
}

function loadingComp() {
  watchEffect(() => {
    compId.value = props.title === "历史记录" ? HistoryItem : CommentItem;
  });
}

loadingComp();

function showDialog() {
  dialog.value.visibleDialog();
}

watch(
  () => props.record,
  (newvalue) => {
    if (Object.keys(newvalue).length > 0) {
      loading.value = false;
    } else {
      loading.value = true;
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  nextTick(() => {
    if (showfooter.value) {
      setPagerClass();
    }
  });
});

onUnmounted(() => {
  muObserve.disconnect();
  muObserve = null;
});
</script>

<style scoped lang="scss">
.parser::after {
  content: "";
  display: block;
  clear: both;
  /* height:0;和overflow:hidden;是为了解决IE兼容的问题 */
  height: 0;
  overflow: hidden;
  /* visibility:hidden;是为了去除content中的文字 */
  visibility: hidden;
}

.scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
