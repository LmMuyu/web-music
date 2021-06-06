<template>
  <Dialog
    ref="dialog"
    @editorContent="(reply) => props.on['send-content'](Object.assign({}, reply, { replyInfo }))"
  />
  <ElContainer class="relative w-full h-full">
    <ElHeader height="56" class="flex justify-between">
      <div>
        <span class="text-base">{{ title }}</span>
      </div>
      <div v-if="commentMod">
        <el-button size="small" @click="pubComment">发表评论</el-button>
      </div>
    </ElHeader>
    <el-main v-if="comploading" class="w-full h-full flex justify-center items-center">
      <loading></loading>
    </el-main>
    <el-main v-else class="relative h-full parser">
      <BetterScroll v-if="renderBS" class="absolute top-0 left-0 w-full h-full">
        <div v-for="(item, index) in data" :key="index">
          <component @comment="clickComment" :scopedData="item" :is="compId"></component>
        </div>
      </BetterScroll>
      <div v-else>
        <component
          v-for="(item, index) in data"
          :key="index"
          :scopedData="item"
          :is="selectComp"
          @comment="clickComment"
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
        :background="paginationbackground"
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
  watchEffect,
  watch,
  shallowRef,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import {
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElButton,
  ElPagination,
  ElMessage,
} from "element-plus";
import BetterScroll from "../../../../../components/betterscroll/BetterScroll.vue";
import Loading from "../../../../../components/svgloading/SvgLoading.vue";
import Dialog, { Reply } from "../components/Dialog.vue";
import HistoryItem from "./HistoryItem.vue";
import CommentItem from "./CommentItem.vue";

import type { SendContent } from "../type";

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
    type: Array,
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
      "send-content": (content: SendContent) => {},
    }),
  },
  shutDialog: {
    type: Boolean,
    default: true,
  },
  commentMod: {
    type: Boolean,
    default: true,
  },
  paginationbackground: Boolean,
});

let replyInfo = null;
const curPage = ref(1);
const dialog = ref(null);
const totalpage = ref(1);
const store = useStore();
const router = useRouter();
const showfooter = ref(false);
const comploading = ref(props.loading);
let muObserve: MutationObserver | null;
const paging = ref<typeof ElPagination | null>(null);
const selectComp = shallowRef<typeof CommentItem | typeof HistoryItem>(CommentItem);

function switchComp(compid: string) {
  if (compid === COMP.Comment) {
    selectComp.value = CommentItem;
  } else if (compid === COMP.History) {
    selectComp.value = HistoryItem;
  }
}

switchComp(props.compId);

function showFooterRef() {
  showfooter.value = !showfooter.value ? true : false;
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

const stop = watchEffect(() => {
  if (props.data.length > 0) {
    comploading.value = false;
    Promise.resolve().then(() => stop());
  }
});

function noLoginMessage() {
  ElMessage({
    type: "error",
    message: "请先登录，再发表评论！",
  });
  router.push({
    path: "/login",
    query: {
      path: router.currentRoute.value.path,
      id: router.currentRoute.value.query.id,
    },
  });
}

function pubComment() {
  const args = [].slice.call(arguments, 0);
  const islogin = store.getters["login/getIslogin"];

  islogin
    ? args.length > 0
      ? dialog.value.visibleDialog.call(dialog.value, ...args)
      : dialog.value.visibleDialog()
    : noLoginMessage();
}

function clickComment(commentitem: any) {
  replyInfo = commentitem;

  const ops: Reply = {
    uid: commentitem.userId,
    commentcontent: commentitem.content,
    avararUrl: commentitem.user.avatarUrl,
    nickanme: commentitem.user.nickname,
  };

  pubComment.call(null, ops);
}

watch(
  () => props.shutDialog,
  (shut) => {
    if (shut === false) {
      dialog.value.hiddenDialog();
    }
  }
);

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
