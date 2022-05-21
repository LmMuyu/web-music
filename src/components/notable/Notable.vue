<template>
  <transition
    name="notable"
    leave-active-class="leave_enter_active"
    enter-active-class="leave_enter_active"
    leave-to-class="leave_translatex"
    enter-to-class="enter_to"
    enter-from-class="enter_translatex"
    @before-leave="beforeLeave"
    @after-leave="afterLeave"
  >
    <div
      ref="group"
      v-if="hidden"
      :style="{ zIndex: !hidden ? -1 : 1 }"
      class="overflow-x-hidden flex"
    >
      <slot></slot>
    </div>
  </transition>
  <div class="w-full flex justify-end">
    <el-pagination
      :page-size="1"
      :current-page="currindex + 1"
      layout="prev, pager, next"
      :total="pagecount"
      :background="false"
      @update:current-page="currPageIndex"
    />
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";

import { ElPagination } from "element-plus";

const ctxEmit = defineEmits(["currentPage"]);

const props = defineProps({
  pagecount: {
    type: Number,
    required: true,
  },
});


const hidden = ref(true);
const group = ref(null);
const leaveTrx = ref("0px");
const enterTrx = ref("0px");
const currindex = ref(0);
const widthView = ref(0);
const direc = ref<"left" | "right" | "">("");
let pre = 0;

function groupWidth(group: HTMLElement) {
  return {
    width: group.offsetWidth,
    height: group.offsetHeight,
  };
}

function isDirection(pre, cur) {
  const value = cur - pre;
  return value < 0 ? "left" : "right";
}

function currPageIndex(index) {
  const direction = isDirection(pre, index);
  direc.value = direction;
  pre = index;
  currindex.value = index;
}

function beforeLeave() {}

function afterLeave() {
  ctxEmit("currentPage", currindex.value);
  hidden.value = true;
}

watch(direc, async (direction) => {
  if (!direc.value) return;
  direc.value = "";

  if (direction === "left") {
    leaveTrx.value = -widthView.value + "px";
    enterTrx.value = widthView.value + "px";
  } else {
    leaveTrx.value = widthView.value + "px";
    enterTrx.value = -widthView.value + "px";
  }

  await nextTick();
  hidden.value = false;
});

onMounted(async () => {
  await nextTick();

  if (group.value) {
    const { height, width } = groupWidth(group.value);
    widthView.value = Number(width);
  }
});
</script>
<style scoped lang="scss">
.leave_enter_active {
  transition: all 0.25s ease-in;
}
.leave_translatex {
  transform: translateX(v-bind(leaveTrx));
}

.enter_translatex {
  transform: translateX(v-bind(enterTrx));
}

.enter_to {
  transform: translateX(0px);
}
</style>
