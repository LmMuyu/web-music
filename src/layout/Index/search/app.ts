import { App, createApp } from "@vue/runtime-dom";
import IndexSearch from "./IndexSearch.vue";

let instance: App<Element> | null = null;

export function mountApp() {
  instance = createApp(IndexSearch,{ 
    unmountApp
  });

  const app = document.querySelector("#app");
  const div = document.createElement("div");
  instance.mount(div);

  app?.appendChild(div);
}

export function unmountApp() {
  if (!!instance) {
    instance.unmount();
  }
}
