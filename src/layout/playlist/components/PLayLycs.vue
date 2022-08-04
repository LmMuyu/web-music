<template>
  <div style="height: 100vh" class="relative overflow-hidden">
    <div
      class="pointer-events-auto transform-gpu transition-all h-full px-14 root-bg-image"
      ref="scrollNode"
      @mouseenter="showCurTimeEvent"
      @mouseleave="leave"
      :style="rootstyle"
    >
      <better-scroll
        :scrollTop="toScrollTop"
        :open-h-render="false"
        :item-len="musicItemList.length"
        class="bg-image"
      >
        <div
          v-for="(musicItem, index) in musicItemList"
          :key="musicItem.playTime"
          class="flex items-center py-3 relative"
          :lycs-key="musicItem.indexId"
          :ref="(r) => lycRenderList.push(r)"
        >
          <div class="flex items-center w-full relative">
            <transition
              v-if="showTimeIndex == index"
              enter-active-class="active"
              enter-to-class="enterTo"
              leave-active-class="active"
              leave-to-class="leaveTo"
            >
              <div class="flex items-center absolute left-0">
                <span class="text-sm">{{ musicItem.originTime }}</span>
                <div class="left_line"></div>
              </div>
            </transition>
            <div
              class="flex justify-center w-full"
              :lycs-key="musicItem.indexId"
              scrollnode="true"
              :keyid="index"
              @click="selectLycs"
            >
              <span
                class="text-sm text-left cursor-pointer whitespace-nowrap text_color"
                :lycplaytime="musicItem.originTime"
                :node_id="musicItem.playTime"
                :lycs-key="musicItem.indexId"
                :keyid="index"
                :style="{ color: colorShowIndex === index && '#409EFF' }"
              >
                {{ musicItem.lyc }}
              </span>
            </div>
            <transition
              v-if="showTimeIndex == index"
              enter-active-class="active"
              enter-to-class="enterTo"
              leave-active-class="active"
              leave-to-class="leaveTo"
            >
              <div class="flex items-center absolute right-0">
                <div class="right_line transform-gpu translate-x-2"></div>
                <div style="width: 45px">
                  <font-icon size="16" icon="iconmore"></font-icon>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </better-scroll>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { computed, nextTick, onMounted, PropType, ref, watchEffect } from "vue";

import { distance, lyricNodeRect } from "../hooks/data";

import FontIcon from "../../../components/fonticon/FontIcon.vue";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";

import type { MatchItem } from "../type";

const ctxEmit = defineEmits(["transiateYPos", "selectlycs"]);

const props = defineProps({
  musicItemList: {
    type: Array as PropType<MatchItem[]>,
    required: true,
  },
  slideScrollTop: {
    type: Number,
    required: true,
  },
  puremusic: Boolean,
  rootstyle: Object,
});

let frist = 0;
let viewPostHeight = 0;
let containerTop = null;
const lycPosMsTime = [];
const store = useStore();
const lycRenderList = [];
let mouseenterPos = false;
const toScrollTop = ref(0);
const colorShowIndex = ref(0);
const showTimeIndex = ref(null);
const scrollNode = ref<HTMLElement | null>(null);

function minToMs(minute: number) {
  return minute * 60 * 1000;
}

function secToMs(sec: number) {
  return sec * 1000;
}

function addTime(min: number, sec: number) {
  return min + sec;
}

function musicTimeList(times: any[]) {
  return times.map((lycinfo) => {
    const [min, sec] = (lycinfo.originTime as string).split(":");

    return addTime(minToMs(parseInt(min)), secToMs(parseInt(sec)));
  });
}

function watchLycToComputedTimeMs() {
  watchEffect(async () => {
    if (props.musicItemList) {
      console.log("函数:watchLycToComputedTimeMs");
      lycPosMsTime.length = 0;
      lycPosMsTime.push(...musicTimeList(props.musicItemList));

      await nextTick();
      viewPostHeight = scrollNode.value.getBoundingClientRect().height;
    }
  });
}

watchLycToComputedTimeMs();

function leave() {
  showTimeIndex.value = null;
  mouseenterPos = false;
}

function showCurTimeEvent(e: Event) {
  if (props.puremusic) return;

  mouseenterPos = true;
  const target = e.target as HTMLElement;

  const curIndex = target.getAttribute("keyid");
  if (curIndex && curIndex !== null) {
    showTimeIndex.value = curIndex;
  }
}

store.commit("pubMitt", ["seek_time", lyctime]);

function lyctime([lycindex, lyctime]: [number, number]) {
  const tranYIndex = binarySearch(lycPosMsTime, Math.floor(lyctime * 1000)) - 1;
  tranYIndex && nodeRectPosY(lycRenderList, tranYIndex);
}

const vpost = computed(() => viewPostHeight / 2);

let prey = 0;

function nodeRectPosY(lycLists: HTMLElement[], tolycIndex: number) {
  colorShowIndex.value = tolycIndex;
  const lycNodeRectTop = nodeRectTop(lycLists[tolycIndex] ?? lycLists[lycLists.length - 1]);
  console.log("lycNodeRectTop:" + lycNodeRectTop);
  console.log("viewPostHeight" + viewPostHeight);

  if (lycNodeRectTop > vpost.value) {
    const y = -Math.abs(Math.floor(lycNodeRectTop - viewPostHeight));
    const addY = addTime;
    prey = addY(y, prey);
    toScrollTop.value = prey;
  }
}

function nodeRectTop(el: HTMLElement) {
  return el.getBoundingClientRect().y;
}

function binarySearch(lists: number[], time: number) {
  let start = 0;
  let end = lists.length - 1;
  let curIndex;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const vtime = lists[mid];

    if (vtime === time) {
      return mid;
    } else if (time > vtime) {
      start = mid + 1;
    } else {
      if (!curIndex || curIndex > mid) {
        curIndex = mid;
      }

      end = mid - 1;
    }
  }

  return curIndex;
}

function selectLycs(e: Event) {
  let target = e.target as HTMLElement;

  if (!target.hasAttribute("scrollnode")) {
    target = target.parentElement;
  }

  const topy = target.getBoundingClientRect().y;

  if (target.hasAttribute("lycs-key")) {
    ctxEmit("selectlycs", topy - containerTop);
  } else {
    console.log("找不到lycs-key");
  }
}

onMounted(async () => {
  await nextTick();
  lyricNodeRect.scrollHeight = scrollNode.value.scrollHeight;
  lyricNodeRect.scrollNode = scrollNode.value;

  frist = scrollNode.value.children[0].clientHeight;
  containerTop = scrollNode.value.getBoundingClientRect().y;
});
</script>
<style scoped lang="scss">
@mixin LineBorder($target: right) {
  width: 80px;
  height: 1px;
  background-image: linear-gradient(to $target, #606266 35%, #cdd0d6, #f0f2f5);
}

.root-bg-image {
  &:deep(.bg-image) {
    background-image: linear-gradient(to bottom, #fafafa 0%, #fff 100%);
  }
}

div {
  transition: all 0.1s linear;
}

.active {
  transition: all 0.2s ease;
}

.enterTo {
  opacity: 1;
}

.leaveTo {
  opacity: 0;
}

.text_color {
  color: #606266;
}

.text_color:hover {
  color: #000;
}

.left_line {
  @include LineBorder;
}

.right_line {
  @include LineBorder(left);
}
</style>
