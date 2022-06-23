<template>
  <ElContainer class="relative w-full h-full">
    <ElHeader height="56" class="flex justify-between">
      <div>
        <span class="text-base">{{ title }}</span>
      </div>
      <div>
        <el-button size="small" @click="dialog.visibleDialog()">发表评论</el-button>
        <Dialog ref="dialog" />
      </div>
    </ElHeader>
    <el-main v-if="comploading" class="w-full h-full flex justify-center items-center">
      <loading></loading>
    </el-main>
    <el-main v-else class="relative h-full parser">
      <BetterScroll v-if="renderBS" class="absolute top-0 left-0 w-full h-full">
        <component
          v-for="(item, index) in data"
          :key="index"
          :scopedData="item"
          :is="compId"
        ></component>
      </BetterScroll>
      <div v-else>
        <component
          v-for="(item, index) in unref(data)"
          :key="index"
          :scopedData="item"
          :is="selectComp"
        ></component>
      </div>
    </el-main>
    <ElFooter v-if="showfooter" class="flex items-center justify-center">
      <el-pagination
        ref="paging"
        v-model:currentPage="curPage"
        @current-change="on['current-change']"
        @next-click="on['next-click']"
        @prev-click="on['prev-click']"
        :page-size="size"
        :total="totalpage"
        layout="prev, pager, next"
        class="flex justify-center"
      ></el-pagination>
    </ElFooter>
  </ElContainer>
</template>

<script setup lang="ts">
import {
  ref,
  PropType,
  nextTick,
  onMounted,
  onUnmounted,
  watch,
  unref,
  Ref,
  watchEffect,
} from "@vue/runtime-core";

import { ElContainer, ElHeader, ElMain, ElFooter, ElButton, ElPagination } from "element-plus";
import BetterScroll from "../../../../../components/betterscroll/BetterScroll.vue";
import Loading from "../../../../../components/svgloading/SvgLoading.vue";
import Dialog from "../components/Dialog.vue";
import HistoryItem from "./HistoryItem.vue";
import CommentItem from "./CommentItem";

enum COMP {
  "History" = "History",
  "Comment" = "Comment",
}

const props = defineProps({
  renderBS: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array as unknown as PropType<Ref<any[]>>,
    required: true,
  },
  title: {
    type: String,
    default: "历史记录",
  },
  compId: {
    type: String as unknown as PropType<"History" | "Comment">,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  on: {
    type: Object as PropType<any>,
    default: () => ({
      "prev-click": (index: number) => {},
      "next-click": (index: number) => {},
      "current-change": (index: number) => {},
    }),
  },
});

const dialog = ref(null);
const curPage = ref(1);
const selectComp = ref<typeof CommentItem | typeof HistoryItem>(CommentItem);
const showfooter = ref(false);
const paging = ref<typeof ElPagination | null>(null);
let muObserve: MutationObserver | null;
const comploading = ref(props.loading);
const totalpage = ref(1);

function switchComp(compid: string) {
  if (compid === COMP.Comment) {
    selectComp.value = CommentItem;
  } else if (compid === COMP.History) {
    selectComp.value = HistoryItem;
  }
}

switchComp(props.compId);

function showFooterRef() {
  if (!showfooter.value) {
    showfooter.value = true;
  } else {
    showfooter.value = false;
  }
}

showFooterRef();

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

function watchData() {
  const stop = watch(props.data, () => {
    comploading.value = false;
    Promise.resolve().then(stop);
  });
}

watchData();

watchEffect(() => {
  if (props.total) {
    totalpage.value = props.total;
  }
});

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

<style scoped lang="scss"></style>
