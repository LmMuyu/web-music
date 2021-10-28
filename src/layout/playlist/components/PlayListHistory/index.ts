import { createApp, nextTick } from "@vue/runtime-dom";

import PlayListHistory from "./PlayListHistory.vue";

import type { App } from "@vue/runtime-dom";

let app: App<Element> | null = null;
let div: HTMLDivElement | null = null;
let root: Element | null = null;

export function openDrawer(recordData: Record<string, any>) {
  const record = recordData.data;

  app = createApp(PlayListHistory, {
    record,
  });

  div = document.createElement("div");
  root = document.querySelector("#app");

  if (!root) return console.error(`root 为 null`);

  root?.appendChild(div);
  app.mount(div);
}

export function unmountApp() {
  nextTick(() => {
    if (app && div && root) {
      app.unmount();
      root.removeChild(div);
      root = null;
      div = null;
    }
  });
}
