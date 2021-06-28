import { App } from "@vue/runtime-core";
import { createApp } from "@vue/runtime-dom";
import { useRefNegate } from "../../utils/useRefNegate";
import Loading from "./Loading.vue";

const div = document.createElement("div");

div.classList.add(...["w-full", "h-full"]);

let install: App<Element> | null = null;
let root: HTMLElement | null = null;

export function createLoading() {
  const { countRef, negate } = useRefNegate(false);

  return {
    countRef,
    negate,
    mountApp,
    unmountApp,
  };
}

export function mountApp(node: string | HTMLElement, backCall?: Function) {
  backCall?.();
  install = createApp(Loading);

  root = node instanceof HTMLElement ? node : document.querySelector(node);
  install.mount(div);
  root?.appendChild(div);

  return unmountApp;
}

export function unmountApp(backcall?: Function) {
  if (install) {
    install.unmount();
    root?.removeChild(div);
    backcall?.();
  }
}
