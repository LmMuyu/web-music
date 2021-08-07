import { App, createApp } from "@vue/runtime-dom";
import PreviewPicture from "./PreviewPicture.vue";

export default class preview {
  mounttag: HTMLElement;
  app: App<Element>;
  options: any;

  mount(imgList: any[], index: number, options?: any) {
    if (this.app) return;

    options = options ?? this.options ?? {};

    this.mounttag = document.createElement("div");
    document.querySelector("body").appendChild(this.mounttag);

    this.app = createApp(PreviewPicture, {
      index,
      imgList,
      options,
      unmount: this.unmount.bind(this),
    });

    this.app.mount(this.mounttag);
  }
  unmount() {
    this.app.unmount();
    this.mounttag.parentNode.removeChild(this.mounttag);
    this.mounttag = null;
    this.app = null;
    return true;
  }
}
