import { currentIndex, mark, moveIndex } from "./data";

export function leaveClass(curIndex: number) {
  if (currentIndex.value === curIndex) return;
  mark.value = "default";
}

export function moveClass(curIndex: number) {
  if (currentIndex.value === curIndex) return;

  mark.value = "move";
  moveIndex.value = curIndex;
}

export function clickClass(curIndex: number) {
  mark.value = "click";
  currentIndex.value = curIndex;
}
