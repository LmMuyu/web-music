<template>
  <div style="height: 100vh" class="relative overflow-hidden">
    <div
      class="pointer-events-auto transform-gpu transition-all h-full px-14 root-bg-image"
      ref="scrollNode"
      :style="rootstyle"
    >
      <better-scroll
        @mousewheel-move="debounce_Scroll"
        :scrollToEl="scrollToEl"
        :open-h-render="false"
        :item-len="musicItemList.length"
        :isminusviewposth="true"
        :bs-options="{
          scrollbar: true,
          observeImage: true,
        }"
        class="bg-image"
      >
        <div
          v-for="(musicItem, index) in musicItemList"
          class="flex items-center py-2 relative"
          @mouseenter="showCurTimeEvent(index)"
          @mouseleave="showTimeIndex = null"
          :lycs-key="musicItem.indexId"
          :ref="(r) => lycRenderList.push(r)"
          :key="musicItem.playTime"
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
              scrollnode="true"
              :lycs-key="musicItem.indexId"
              @click="
                scrollToTop(allTimeToSec(musicItem.originTime), 'click').then(
                  () => ctxEmit('lycTime', musicItem.originTime)
                )
              "
            >
              <span
                class="text-sm text-left cursor-pointer whitespace-nowrap text_color"
                :lycs-key="musicItem.indexId"
                :keyid="index"
                :style="{
                  color:
                    colorShowIndex >= index
                      ? '#409EFF'
                      : colorShowIndex === musicItemList.length - 2
                      ? '#409EFF'
                      : '',
                }"
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
import { nextTick, onMounted, PropType, ref, watchEffect } from "vue";

import { lyricNodeRect } from "../hooks/data";
import { allTimeToSec } from "../../../utils/filterDate";

import FontIcon from "../../../components/fonticon/FontIcon.vue";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";

import type { MatchItem } from "../type";
import { debounce } from "../../../utils/debounce";

const ctxEmit = defineEmits(["transiateYPos", "lycTime"]);

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
let openScrollToEl = true;
const scrollToEl = ref(null);
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

function showCurTimeEvent(curIndex: number) {
  if (props.puremusic) return;

  if (curIndex && curIndex !== null) {
    showTimeIndex.value = curIndex;
  }
}

store.commit("pubMitt", ["seek_time", lyctime]);

function lyctime([lycindex, lyctime]: [number, number]) {
  scrollToTop(lyctime, "play");
}

function scrollToTop(time: number, event: "click" | "play" = "play") {
  const tranYIndex =
    binarySearch(lycPosMsTime, Math.floor(time * 1000)) -
    (event === "play" ? 1 : 0);
  tranYIndex && nodeRectPosY(lycRenderList, tranYIndex);

  return Promise.resolve();
}

function nodeRectPosY(lycLists: HTMLElement[], tolycIndex: number) {
  colorShowIndex.value = tolycIndex;

  if (openScrollToEl) {
    const el = lycLists[tolycIndex] ?? lycLists[lycLists.length - 1];
    scrollToEl.value = el;
  }
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

  return curIndex === -1 ? 0 : curIndex;
}

const debounce_Scroll = debounce(onScroll, 1500, {
  quickrequest: true,
  totRiggerQuickrequest: true,
});

function onScroll() {
  openScrollToEl = !openScrollToEl;
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
