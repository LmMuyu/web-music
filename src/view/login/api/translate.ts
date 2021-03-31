import { Ref } from "@vue/reactivity";

export default function setTranslate(
  el: HTMLElement,
  position: Ref<Record<string, number>>
) {
  const node = el;
  const { x, y } = position.value;

  node.style.left = x + "px";
  node.style.top = y + "px";
}
