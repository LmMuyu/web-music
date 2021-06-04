import { createApp } from "@vue/runtime-dom";
import type { App } from "@vue/runtime-dom";
import PlayListHistory from "./PlayListHistory.vue";

let app: App<Element> | null = null;
export function openDrawer(recordData: Record<string, any>) {
  const record = recordData.data;

  app = createApp(PlayListHistory, {
    record,
  });

  const div = document.createElement("div");
  document.querySelector("#app")?.appendChild(div);

  app.mount(div);
}
