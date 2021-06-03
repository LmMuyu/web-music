import { App, createApp } from "@vue/runtime-dom";
import router from "../../../routes";
import IndexSearch from "./IndexSearch.vue";

let instance: App<Element> | null = null;

export function mountApp() {
  instance = createApp(IndexSearch, {
    unmountApp,
  });

  const app = document.querySelector("#app");
  const div = document.createElement("div");
  instance.use(router).mount(div);

  app?.appendChild(div);
}

export function unmountApp() {
  if (!!instance) {
    instance.unmount();
  }
}
