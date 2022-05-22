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
      :current-page="currindex === 0 ? currindex + 1 : currindex"
      layout="prev, pager, next"
      :total="pagecount"
      :background="false"
      @update:current-page="currPageIndex"
      ref="pagination"
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
const pagination = ref<typeof ElPagination>(null);

let isChangeStyle = true;

function runNumberStylecss(index: number) {
  if (index >= 5 && index <= 9) {
    if (isChangeStyle) {
      paginationQuick();
      isChangeStyle = false;
    }
  }

  if (index < 5 || index > 9) {
    if (!isChangeStyle) {
      isChangeStyle = true;
    }
  }
}

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

async function currPageIndex(index) {
  const direction = isDirection(pre, index);
  direc.value = direction;
  pre = index;
  currindex.value = index;

  await nextTick();
  runNumberStylecss(index);
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

function paginationQuick() {
  //@ts-ignore
  const el = pagination.value.$el as HTMLElement;
  const quickbtn = ["btn-quicknext", "btn-quickprev"];

  quickbtn.forEach((attriclass) => {
    const quickdian = el.querySelector(`.${attriclass}`);

    if (quickdian) {
      (quickdian as HTMLElement).style.cssText = `
        display:flex;
        justify-content:center;
        align-items:center;
       `;
    }
  });

  (el.querySelector(".el-pager") as HTMLElement).style.cssText = `
    display:flex;
   `;
}

onMounted(async () => {
  await nextTick();

  if (group.value) {
    const { height, width } = groupWidth(group.value);
    widthView.value = Number(width);
  }

  if (pagination.value) {
    paginationQuick();
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
