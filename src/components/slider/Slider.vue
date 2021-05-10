`
<template>
  <div
    class="slider_track rounded-md h-3 relative flex items-center"
    ref="first_track"
    @click="clickCurrent"
    id="slider"
  >
    <div
      class="rounded-md h-full pointer-events-none flex items-center"
      :style="{
        width: currentPosition + 'px',
        backgroundColor: background,
      }"
      ref="top_track"
    >
      <span
        class="border_rad bg-black absolute pointer-events-auto cursor-pointer transform -translate-x-1"
        :class="tooltipStyleClass"
        :style="{ left: currentPosition + 'px' }"
        id="tooltip"
        @mousedown="startdown"
        ref="tooltip"
      ></span>
    </div>
  </div>
</template>
<script setup>
import {
  ref,
  onMounted,
  nextTick,
  defineProps,
  computed,
  defineEmit,
  watch,
  shallowRef,
} from "vue";

const ctxEmit = defineEmit(["update:modelValue", "mousemove", "click"]);

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
  tooltipStyleClass: {
    type: Array,
    default: () => ["w-4", "h-4"],
  },
  background: {
    type: String,
    default: "red",
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

function startdown(e) {
  id = getID(e);
  that.value = true;
  setTransitionTime(0);
}

function moving(e) {
  if (that.value) {
    e.preventDefault();
    ctxEmit("mousemove");
    setValueOnPos(getMoveEndPos(e), true);
  }
}

function moveEnd() {
  that.value = false;
}

function clickCurrent(e) {
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

function getID(e) {
  return e.target.getAttribute("id");
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

function getMoveEndPos(e) {
  return e.clientX - slider_track_left.value;
}

function setValueOnPos(val, bool) {
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

function setTransforme(val) {
  let value = val - tooltip_scrollWidth.value;
  currentPosition.value = value;
}

function asyncValue(val) {
  ctxEmit("update:modelValue", val);
}

function isDiff(cur, val) {
  return cur !== val;
}

function setCurrentValue(val, bool) {
  // console.log(val);
  if (val < props.min || val > props.max) return false;

  if (isDiff(currentValue.value, val)) {
    currentValue.value = val;
  }

  bool || setPosition();
}

function setPosition(delay) {
  delay ? (interdelay = delay) : (interdelay = seedp);

  if (!that.value) {
    setTransitionTime(delay !== undefined ? delay : seedp);
  } else {
    setTransitionTime(0);
  }
  setTransforme(position.value);
}

function setTransitionTime(time) {
  top_track.value.style.transitionDuration = `${time}s`;
  top_track.value.style.WebkitTransitionDuration = `${time}s`;
  tooltip.value.style.transitionDuration = `${time}s`;
  tooltip.value.style.WebkitTransitionDuration = `${time}s`;
}

function bindEvents() {
  document.addEventListener("mousemove", moving, false);
  document.addEventListener("mouseup", moveEnd, false);
  document.addEventListener("mouseleave", moveEnd, false);
  window.addEventListener("resize", resize, false);
}

function getSlideRect() {
  slider_track_width.value = first_track.value.offsetWidth;
  slider_track_left.value = first_track.value.getBoundingClientRect().left;
  tooltip_scrollWidth.value = tooltip.value.scrollWidth / 3 - 2;
}

onMounted(() => {
  nextTick(() => getSlideRect());
  bindEvents();
});
</script>
<style scoped>
.slider_track {
  transform: translateX(-50%, -50%);
  border: 1px solid rgb(107, 225, 255);
}

.border_rad {
  border-radius: 100%;
}
</style>
