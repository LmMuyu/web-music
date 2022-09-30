<template>
  <div class="flex justify-center items-center w-full h-full py-4">
    <div
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
      class="flex items-center w-full relative wind"
      :style="{ height: `${h}px` }"
    >
      <div
        :style="{ width: `${allWidth + offsetW}px` }"
        class="relative h-full overflow-hidden"
      >
        <div
          v-show="btn_button"
          class="absolute top-0 left-0 h-full flex items-center z-10 btn-prev"
          @click="btnPrev"
        >
          <font-icon icon="iconarrow-right-copy" size="24"></font-icon>
        </div>
        <transition
          @enter="enter"
          @before-leave="leave"
          appear
          name="tali"
          mode="default"
        >
          <NotableWind
            v-if="show"
            :class="!show ? 'absolute top-0 left-0' : ''"
            :list="showlist"
            :width="w"
            :height="h"
          />

          <NotableWind
            v-else="show"
            :class="!show ? 'absolute top-0 left-0' : ''"
            :list="showlist"
            :width="w"
            :height="h"
          />
        </transition>
        <div
          v-show="btn_button"
          class="absolute top-0 right-0 h-full flex justify-center items-center z-10 btn-next"
          @click="btnNext"
        >
          <font-icon icon="iconmore" size="24"></font-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

import FontIcon from "../../../../../../components/fonticon/FontIcon.vue";
import NotableWind from "./NotableWind.vue";

let continuous = true;

const btn_button = ref(false);

const w = ref(200);
const h = ref(150);
const offsetW = computed(() => w.value / 2);
const allWidth = computed(() => w.value * 4);

const start = ref(0);
const end = computed(() => start.value + 4);

const show = ref(true);

const toleave = ref(-allWidth.value + "px");
const fromenter = ref(allWidth.value + "px");

const imglist = ref([]);
const showlist = ref([]);

watchEffect(() => {
  let i = end.value + 1;
  i > imglist.value.length - 1 && (i = 0);

  if (imglist.value.length > 0) {
    showlist.value = [
      ...imglist.value.slice(start.value, end.value),
      imglist.value[i],
    ];
    if (showlist.value.length !== 5) {
      console.log(showlist.value);
      console.log({ start, end });
    }
  }
});

function leave() {
  continuous = false;
}

function enter() {
  continuous = true;
}

function btnPrev() {
  if (!continuous) return;
  toleave.value = -allWidth.value + "px";
  fromenter.value = allWidth.value + "px";

  if (start.value - 4 < 0) {
    start.value = imglist.value.length - 4;
  } else {
    start.value -= 4;
  }

  show.value = !show.value;
}
function btnNext() {
  if (!continuous) return;
  toleave.value = allWidth.value + "px";
  fromenter.value = -allWidth.value + "px";

  if (start.value + 4 >= imglist.value.length) {
    start.value = 0;
  } else {
    start.value += 4;
  }

  show.value = !show.value;
}

function mouseenter() {
  btn_button.value = true;
}

function mouseleave() {
  btn_button.value = false;
}
</script>
<style>
.tali-leave-active,
.tali-enter-active {
  transition: all 0.25s ease;
}

.tali-enter-from {
  transform: translate(v-bind(fromenter), 0);
}

.tali-leave-to {
  transform: translate(v-bind(toleave), 0);
}
</style>
