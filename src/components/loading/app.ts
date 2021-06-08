import { App } from "@vue/runtime-core";
import { createApp } from "@vue/runtime-dom";
import Loading from "./Loading.vue";

const div = document.createElement("div");

div.classList.add(...["w-full", "h-full"]);

let install: App<Element> | null = null;

export function mountApp(node: string, backCall: Function) {
  backCall();
  install = createApp(Loading);

  const root = document.querySelector(node);
  install.mount(div);

  root?.appendChild(div);
}

export function unmountApp(backcall: Function) {
  if (install) {
    install.unmount();
    backcall();
  }
}
