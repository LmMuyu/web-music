<template>
  <div
    class="slider_track relative flex items-center cursor-pointer w-full"
    ref="first_track"
    @click="clickCurrent"
    id="slider"
  >
    <div
      class="cursor-pointer pointer-events-none flex items-center"
      :style="{
        width: currentPosition + 'px',
        backgroundColor: background,
        height: 4 + 'px'
      }"
      ref="top_track"
    >
      <span
        class="w-2 h-2 absolute pointer-events-auto transform -translate-x-1 rounded-md"
        :style="{ left: currentPosition + 'px', backgroundColor: '#318FB5' }"
        @mousedown="startdown"
        id="tooltip"
        ref="tooltip"
      ></span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  onMounted,
  nextTick,
  computed,
  watch,
  shallowRef,
} from "vue";

const ctxEmit = defineEmits(["update:modelValue", "mousemove", "click"]);

const props = defineProps({
  modelValue: Number,
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  background: {
    type: String,
    default: "#8fc2ff",
  },
});

const first_track = ref(null);
const tooltip = ref(null);
const top_track = ref(null);

let id = "";
let seedp = 0;
let interdelay = 0;
let isTran = false;
let that = shallowRef(false);
const tooltip_scrollWidth = shallowRef(0);
const thatClick = shallowRef(false);
const slider_track_width = ref(0);
const slider_track_left = ref(0);
const currentPosition = ref(0);
const currentValue = ref(0);

watch(
  () => props.modelValue,
  (value) => {
    if (value && value < props.max && !that.value) {
      const Post = getValueOfEachCell.value * value;
      if (!isTran) {
        const delay = seedp ? seedp : 0.5;
        setTransitionTime(delay);
        isTran = !isTran;
        return;
      }

      setTransforme(Post);
    }
  }
);

function resize() {
  nextTick(() => {
    getSlideRect();
  });
}

function startdown(e: MouseEvent) {
  id = getID(e);
  that.value = true;
  setTransitionTime(0);
}

function moving(e: MouseEvent) {
  if (that.value) {
    e.preventDefault();
    ctxEmit("mousemove");
    setValueOnPos(getMoveEndPos(e), true);
  }
}

function moveEnd() {
  that.value = false;
}

function clickCurrent(e: Event) {
  id = getID(e);
  if (!that.value && id === "slider") {
    seedp = 0.5;
    thatClick.value = true;
    ctxEmit("click");
    setValueOnPos(getMoveEndPos(e), false);

    nextTick().then(() =>
      setTimeout(() => setTransitionTime(0), interdelay * 1000)
    );
  }
}

function getID(e: any) {
  return e && e.target.getAttribute("id");
}

const total = computed(() => {
  return (props.max - props.min) / 1;
});

//用滑块宽度 / 除以 total 来获取每一次滑动的的值
const getValueOfEachCell = computed(() => {
  return slider_track_width.value / total.value;
});

const position = computed(() => {
  return (currentValue.value - props.min) * getValueOfEachCell.value;
});

function getMoveEndPos(e: any) {
  return e.clientX - slider_track_left.value;
}

function setValueOnPos(val: number, bool: boolean) {

  if (val > 0 && val < slider_track_width.value) {
    setTransforme(val);

    let v = Math.round(val / getValueOfEachCell.value) + props.min;
    if (thatClick.value || that.value) {
      asyncValue(v);
    }

    setCurrentValue(v, bool);
  } else if (val > slider_track_width.value) {
    setTransforme(slider_track_width.value);
  } else if (val < 0) {
    setTransforme(0);
  }
}

function setTransforme(val: number) {
  let value = val - tooltip_scrollWidth.value;
  currentPosition.value = value;
}

function ifTrackWidth() {
  const track = top_track.value as HTMLElement
  const width = track.getBoundingClientRect().width

  if (currentPosition.value !== width) {
    track.style.cssText = `${currentPosition.value}px;transition:all 0.5s`
  }
}

function asyncValue(val: number) {
  ctxEmit("update:modelValue", val);
}

function isDiff(cur: number, val: number) {
  return cur !== val;
}

function setCurrentValue(val: number, bool: boolean) {
  if (val < props.min || val > props.max) return false;
  if (isDiff(currentValue.value, val)) {
    currentValue.value = val;
  }

  bool || setPosition();
}

function setPosition(delay?: number | undefined) {
  delay ? (interdelay = delay) : (interdelay = seedp);

  if (!that.value) {
    setTransitionTime(delay !== undefined ? delay : seedp);
  } else {
    setTransitionTime(0);
  }
  setTransforme(position.value);
}

function setTransitionTime(time: number) {
  (
    top_track.value as unknown as HTMLElement
  ).style.transitionDuration = `${time}s`;

  (
    top_track.value as unknown as HTMLElement
  ).style.webkitTransitionDuration = `${time}s`;

  (
    tooltip.value as unknown as HTMLElement
  ).style.transitionDuration = `${time}s`;

  (
    tooltip.value as unknown as HTMLElement
  ).style.webkitTransitionDuration = `${time}s`;
}

function bindEvents() {
  document.addEventListener("mousemove", moving, false);
  document.addEventListener("mouseup", moveEnd, false);
  document.addEventListener("mouseleave", moveEnd, false);
  window.addEventListener("resize", resize, false);
}

function getSlideRect() {
  slider_track_width.value = (
    first_track.value as unknown as HTMLElement
  ).offsetWidth;

  slider_track_left.value = (
    first_track.value as unknown as HTMLElement
  ).getBoundingClientRect().left;

  tooltip_scrollWidth.value =
    (tooltip.value as unknown as HTMLElement).scrollWidth / 3 - 2;
}

onMounted(() => {
  nextTick(() => getSlideRect());
  bindEvents();
});
</script>
<style scoped lang="scss">
.slider_track {
  transform: translateX(-50%, -50%);
  border: 1px solid #8fc2ff;
  height: 4px;
}

.border_rad {
  border-radius: 100%;
  width: 6.28px;
  height: 6.28px;
}
</style>
