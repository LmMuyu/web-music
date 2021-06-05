import { Ref, ref } from "@vue/reactivity";

export const linkClass = ref(["active_link", "py-1", "px-4", "rounded-lg"]);

export function mouseenter(e: MouseEvent, active: number, index: number) {
  if (active === index) {
    e.preventDefault();
    return;
  }

  const target = e.target as HTMLElement;
  target.classList.add(...linkClass.value);
}

export function mouseout(e: MouseEvent, active: number, index: number) {
  if (active === index) {
    e.preventDefault();
    return;
  }

  const target = e.target as HTMLElement;
  target.classList.remove(...linkClass.value);
}
