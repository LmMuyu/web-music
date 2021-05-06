import type { Ref } from "@vue/reactivity";

export function mouseEnter(isEnter: Ref<boolean>) {
  isEnter.value = !isEnter.value;
}

export function mouseLeave(isEnter: Ref<boolean>) {
  isEnter.value = !isEnter.value;
}
