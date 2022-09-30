<template>
  <div :style="style" :class="calss" class="w-full h-1/2 relative">
    <transition
      v-for="slotname in forlinkelist"
      :key="slotname"
      :enter-from-class="linkelist.value === slotname ? 'enter_translatex' : ''"
      :leave-to-class="
        linkelist.next.next.value === slotname ? 'leave_translatex' : ''
      "
      leave-active-class="leave_enter_active"
      enter-active-class="leave_enter_active"
      enter-to-class="enter_to"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <div
        ref="group"
        v-if="linkelist.value === slotname"
        :style="
          Object.assign(
            {},
            {
              zIndex: linkelist.value === slotname ? 1 : -1,
            },
            linkelist.value === slotname ? activeCompStyle : {}
          )
        "
        class="overflow-x-hidden flex"
      >
        <slot :name="slotname"></slot>
      </div>
    </transition>
  </div>

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
import { computed, nextTick, onMounted, ref, watch } from "vue";

import { ElPagination } from "element-plus";

interface transitionEnterLeaveInfo {
  fromEnterTrX: string;
  toLeaveTrX: string;
}

interface linklist {
  value: string;
  next: linklist;
  style: transitionEnterLeaveInfo;
}

const ctxEmit = defineEmits(["currentPage"]);

const props = defineProps({
  pagecount: {
    type: Number,
    required: true,
  },
  calss: String,
  style: Object,
});

let pre = 0;
const group = ref(null);
const currindex = ref(0);
const widthView = ref(0);
const direc = ref<"pre" | "next" | "">("");
const pagination = ref<typeof ElPagination>(null);
const linkelist = ref<linklist>(linke());
const forlinkelist = ref(forlinke(linkelist.value));
const fromEnterTrx = computed(() => linkelist.value.style.fromEnterTrX);
const toLeaveTrx = computed(() => linkelist.value.next.next.style.toLeaveTrX);

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
  return value > 0 ? "next" : "pre";
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
}

watch(direc, async (direction) => {
  if (!direc.value) return;
  direc.value = "";

  if (direction === "next") {
    linkelist.value.style.toLeaveTrX = widthView.value + "px";
    linkelist.value.next.style.fromEnterTrX = -widthView.value + "px";
    linkelist.value = linkelist.value.next;
  } else {
    linkelist.value.next.next.style.fromEnterTrX = widthView.value + "px";
    linkelist.value.style.toLeaveTrX = -widthView.value + "px";
    linkelist.value = linkelist.value.next.next;
  }

  console.log(linkelist.value);
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

function linke() {
  function linkNode(val: string): linklist {
    return {
      value: val,
      style: {
        fromEnterTrX: "0px",
        toLeaveTrX: "0px",
      },
      next: null,
    };
  }

  const midd = linkNode("midd");
  const left = linkNode("left");
  const right = linkNode("right");

  midd.next = right;
  right.next = left;
  left.next = midd;

  return midd;
}

function forlinke(linkelist: linklist) {
  return [linkelist.value, linkelist.next.value, linkelist.next.next.value];
}

const activeCompStyle = computed(() => ({
  position: "absolute",
  left: "0px",
  top: "0px",
  width: "100%",
}));

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
  transform: translateX(v-bind(toLeaveTrx));
}

.enter_translatex {
  transform: translateX(v-bind(fromEnterTrx));
}

.enter_to {
  transform: translateX(0px);
}
</style>
