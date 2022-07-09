import { createApp, nextTick, Ref, ref } from "@vue/runtime-dom";

import PlayListHistory from "./PlayListHistory.vue";

import type { App } from "@vue/runtime-dom";
import type { ElPagination } from "element-plus";
import type { Include, OPTIONS } from "./type";
import store from "../../../../store";
import router from "../../../../routes";

let app: App<Element> | null = null;
let div: HTMLDivElement | null = null;
let root: Element | null = null;

export function openDrawer<T extends any[] | Ref<any[]>>(
  recordData: T,
  title = "历史记录",
  options?: OPTIONS &
    Partial<Include<typeof ElPagination, "prev-click" | "next-click" | "current-change">>
) {
  const open = (function () {
    const isopen = ref(false);

    app = createApp(PlayListHistory, {
      title,
      record: {
        allData: recordData,
        isopen,
      },
      on: {
        "prev-click": options["prev-click"],
        "next-click": options["next-click"],
        "current-change": options["current-change"],
      },
      total: options.total,
      size: options.size,
      unmountApp,
    });

    div = document.createElement("div");
    root = document.querySelector("body");
    root?.appendChild(div);
    plugin(app, [store, router]);
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

function plugin(app: App, plugins: any[]) {
  plugins.forEach((plugin) => app.use(plugin));
}
