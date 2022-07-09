<template>
  <div
    class="pointer-events-auto relative transform-gpu transition-all px-14"
    ref="scrollNode"
    @mouseover="showCurTimeEvent"
    @mouseleave="showTimeIndex = null"
    @click="selectLycs"
    :style="rootstyle"
  >
    <div
      v-for="(musicItem, index) in musicItemList"
      :key="musicItem.playTime"
      class="flex items-center py-3 relative"
      :lycs-key="musicItem.indexId"
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
        >
          <span
            class="text-sm text-left cursor-pointer whitespace-nowrap text_color"
            :lycplaytime="musicItem.originTime"
            :node_id="musicItem.playTime"
            :lycs-key="musicItem.indexId"
            :keyid="index"
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
  </div>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { nextTick, onMounted, PropType, ref } from "vue";

import { distance, lyricNodeRect } from "../hooks/data";

import FontIcon from "../../../components/fonticon/FontIcon.vue";

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

const showTimeIndex = ref(null);
const scrollNode = ref<HTMLElement | null>(null);
const store = useStore();
let frist = 0;

function showCurTimeEvent(e: Event) {
  if (props.puremusic) return;

  const target = e.target as HTMLElement;

  const curIndex = target.getAttribute("keyid");
  if (curIndex && curIndex !== null) {
    showTimeIndex.value = curIndex;
  }
}

function lyctime(lyctime: number) {
  // console.log(lyctime);

  const maxTransiateYHeight = lyricNodeRect.scrollHeight - props.slideScrollTop;
  const trnsiateY = lyctime * frist;
  if (maxTransiateYHeight > trnsiateY) {
    return;
  }

  distance.value = trnsiateY;
  ctxEmit("transiateYPos", trnsiateY);
}

store.commit("pubMitt", ["seek_time", lyctime]);

function selectLycs(e: Event) {
  let target = e.target as HTMLElement;

  if (!target.hasAttribute("scrollnode")) {
    target = target.parentElement;
  }

  if (target.hasAttribute("lycs-key")) {
    ctxEmit("selectlycs", e.target as HTMLElement);
  } else {
    console.log("找不到lycs-key");
  }
}

onMounted(async () => {
  await nextTick();
  lyricNodeRect.scrollHeight = scrollNode.value.scrollHeight;
  frist = scrollNode.value.children[0].clientHeight;
});
</script>
<style scoped lang="scss">
@mixin LineBorder($target: right) {
  width: 80px;
  height: 1px;
  background-image: linear-gradient(to $target, #606266 35%, #cdd0d6, #f0f2f5);
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
