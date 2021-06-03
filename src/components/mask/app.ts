import { App } from "@vue/runtime-core";
import { createApp } from "@vue/runtime-dom";
import { nodeRoot } from "./hooks/methods";
import Mask from "./Mask.vue";

let instance: App<Element> | null = null;

export function mountApp(
  unmountFn?: Function,
  node: string = "#app",
  bgcolor?: string
) {
  const nodes = nodeRoot(node);

  instance = createApp(Mask, {
    unmountFn: [unmountFn ? unmountFn : () => {}, unmountApp],
    root: node,
    bgcolor,
  });

  const root = document.querySelector(nodes.value);
  const div = document.createElement("div");

  instance.mount(div);
  root?.appendChild(div);
}

export function unmountApp() {
  if (instance) {
    instance.unmount();
  }
}
