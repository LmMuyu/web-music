import { computed, ref } from "@vue/runtime-core";

import type { Ref } from "vue";

interface Options {
  clickColor: string;
  moveColor: string;
}

const mark = ref<"click" | "move" | "default">("click");

function setColor(curIndex: Ref<number>, index: number, color: string) {
  return {
    color: curIndex.value === index ? color : "#636e72",
  };
}

function leaveClass(currentIndex: Ref<number>) {
  return function (curIndex: number) {
    if (currentIndex.value === curIndex) return;
    mark.value = "default";
  };
}

function moveClass(currentIndex: Ref<number>, moveIndex: Ref<number>) {
  return function (curIndex: number) {
    if (currentIndex.value === curIndex) return;

    mark.value = "move";
    moveIndex.value = curIndex;
  };
}

function clickClass(currentIndex: Ref<number>) {
  return function (curIndex: number) {
    mark.value = "click";
    currentIndex.value = curIndex;
  };
}

export function activeIndex(
  currentIndex: Ref<number>,
  moveIndex: Ref<number>,
  options: Options = {
    clickColor: "#74b9ff",
    moveColor: "#74b9ffb3",
  }
) {
  const { clickColor, moveColor } = options;

  const activeClass = computed(() => (index: number) => {
    if (mark.value === "click" || currentIndex.value === index) {
      return setColor(currentIndex, index, clickColor);
    }

    return mark.value === "move"
      ? setColor(moveIndex, index, moveColor)
      : {
          color: "#636e72",
        };
  });

  const clickActive = clickClass(currentIndex);
  const moveActive = moveClass(currentIndex, moveIndex);
  const leaveActive = leaveClass(currentIndex);

  return Object.create({
    activeClass,
    clickActive,
    moveActive,
    leaveActive,
  });
}
