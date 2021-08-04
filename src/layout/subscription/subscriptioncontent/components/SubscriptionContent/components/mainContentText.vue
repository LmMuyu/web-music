<template>
  <div class="root line_h">
    <p
      v-html="toParseJson"
      ref="rootp"
      class="multiple_lines_omitted deep_style"
    ></p>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
} from "@vue/runtime-core";
import { useRouter } from "vue-router";

import type { PropType } from "vue";

const props = defineProps({
  msg: {
    type: String,
    default: "",
  },
  actId: {
    type: Number,
    default: 0,
  },
  actIds: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});

const rootp = ref<HTMLElement | null>(null);
const HyperlinkList = shallowRef<HTMLElement[]>([]);
const router = useRouter();

const sortActIds = computed(() => {
  const len = props.actIds.length;
  if (len === 0) {
    return [];
  } else if (len === 1) {
    return props.actIds;
  }

  const posIndex = props.actIds.indexOf(props.actId);

  if (len === 2 && posIndex === 1) return props.actIds;

  props.actIds.push(props.actIds.splice(posIndex, 1)[0]);
  return props.actIds;
});

const toParseJson = computed(() => {
  const renderStr: string = props.msg;
  if (!renderStr) return "";

  let index = 0;

  return renderStr.replace(/(\n|#((\p{sc=Han}|\d|\w)+?)#)/gu, function ($1) {
    let s = !!$1.trim();

    if (s) {
      return `<a herf="javascript:;;" style="color:#74b9ff;" data-id="${
        sortActIds.value[index++]
      }" class="activity decoration cursor-pointer">${$1}</a>`;
    } else {
      return "<br/>";
    }
  });
});

const HyperlinkClick = (e: Event) => {
  const target = e.target as HTMLElement;

  const actId = target.getAttribute("data-id");

  router.push({
    path: "/activity",
    query: {
      id: actId,
    },
  });
};

onMounted(() => {
  nextTick().then(() => {
    HyperlinkList.value.concat(
      Array.from(rootp.value.querySelectorAll(".activity")),
      Array.from(rootp.value.querySelectorAll(".user"))
    );

    HyperlinkList.value.map((v) => {
      v.addEventListener("click", HyperlinkClick, false);
    });
  });
});

onUnmounted(() => {
  HyperlinkList.value.map((v) => {
    v.removeEventListener("click", HyperlinkClick, false);
  });
});
</script>
<style scoped lang="scss">
.line_h {
  line-height: 24px;
}
.multiple_lines_omitted {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

.root {
  &:deep(.decoration) {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.deep_style {
  @include hover_dec;
}
</style>
