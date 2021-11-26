import { createApp, nextTick, Ref, ref } from "@vue/runtime-dom";

import PlayListHistory from "./PlayListHistory.vue";

import type { App } from "@vue/runtime-dom";

let app: App<Element> | null = null;
let div: HTMLDivElement | null = null;
let root: Element | null = null;

export function openDrawer<T extends any[] | Ref<any[]>>(recordData: T) {
  const open = (function () {
    const isopen = ref(false);

    app = createApp(PlayListHistory, {
      record: {
        allData: recordData,
        isopen,
      },
      unmountApp,
    });

    div = document.createElement("div");
    root = document.querySelector("body");
    root?.appendChild(div);
    app.mount(div);

    return () => (isopen.value = false);
  })();

  nextTick().then(open);
}

export function unmountApp() {
  nextTick().then(() => {
    if (app && div && root) {
      app.unmount();
      root.removeChild(div);
      root = div = app = null;
    }
  });
}
