import { App } from "@vue/runtime-core";
import { createApp } from "@vue/runtime-dom";
import Loading from "./Loading.vue";

const div = document.createElement("div");

let install: App<Element> | null = null;

export function mountApp(node: string) {
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
