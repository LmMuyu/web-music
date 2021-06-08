import { App } from "@vue/runtime-core";
import { createApp } from "@vue/runtime-dom";
import Loading from "./Loading.vue";

const div = document.createElement("div");

div.classList.add(...["w-full", "h-full"]);

let install: App<Element> | null = null;
let root: HTMLElement | null = null;

export function mountApp(node: string, backCall: Function) {
  backCall();
  install = createApp(Loading);

  root = document.querySelector(node);
  install.mount(div);

  root?.appendChild(div);
}

export function unmountApp(backcall: Function) {
  if (install) {
    install.unmount();
    root?.removeChild(div);
    backcall();
  }
}
