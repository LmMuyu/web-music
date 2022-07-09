<template>
  <el-drawer
    @closed="onClosed"
    :showClose="false"
    :withHeader="false"
    :modelValue="isopen"
    :size="containerWidth"
  >
    <CommtentContainer
      :compId="compId"
      :loading="loading"
      :size="size"
      :total="total"
      :on="on"
      :title="title"
      :data="data"
      :renderBS="false"
    />
  </el-drawer>
</template>
<script setup lang="ts">
import { defineProps, onUnmounted, shallowRef, watch, watchEffect } from "@vue/runtime-core";
import { computed, isRef, PropType, ref } from "vue";

import { ElDrawer, ElPagination } from "element-plus";
import CommtentContainer from "./components/CommtentContainer.vue";

import type { Include } from "./type";

enum COMP {
  "History" = "History",
  "Comment" = "Comment",
}

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
      "send-content": () => {},
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

const loading = ref(true);
const compId = shallowRef<COMP.History | COMP.Comment>(COMP.Comment);

//@ts-ignore
const data = computed(() => props.record.allData?.value ?? props.record.allData);
console.log(data.value);

const isopen = computed(() => isRef(props.record.isopen));
const onClosed = () => props.unmountApp();

const ishistory = computed(() => props.title === "历史记录");
const containerWidth = computed(() => (ishistory.value ? "25%" : "50%"));

const stop = watchEffect(() => {
  compId.value = props.title === "历史记录" ? COMP.History : COMP.Comment;
});

const watcrec = watch(
  () => props.record,
  (newvalue) => (loading.value = Object.keys(newvalue).length > 0 ? false : true),
  {
    immediate: true,
  }
);

onUnmounted(() => {
  stop();
  watcrec();
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
