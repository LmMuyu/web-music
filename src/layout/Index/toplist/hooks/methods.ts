import { nextTick } from "vue";
import type { ListItem } from "../types/requestType";
import { elementScrollTop, mainShowData, rowRoot } from "./data";

let isClass: boolean | null = null;

export function onMouseenter(e: MouseEvent) {
  let htmlel = e.target as HTMLElement;
  isClass = htmlel.classList.contains("bg-gray-300");

  if (!isClass) {
    htmlel.classList.add("bg-gray-100");
  }
}
export function onMouseleave(e: MouseEvent) {
  let htmlel = e.target as HTMLElement;

  if (!isClass) {
    htmlel.classList.remove("bg-gray-100");
  }
}

export function setContentData(mainData: ListItem[] | undefined) {
  if (!mainData) return;

  mainData && (mainShowData.value = mainData);
}

export function setTransition(
  rowRoot: HTMLElement,
  duration: number,
  seelp?: number
) {
  duration = duration ? duration : seelp ? seelp : 0;

  rowRoot.style.transitionDuration = duration + "s";
  rowRoot.style.transitionTimingFunction = "ease-in-out";
  rowRoot.style.transitionProperty = "translateY";
}
