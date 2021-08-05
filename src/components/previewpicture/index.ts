import { App, createApp } from "@vue/runtime-dom";
import PreviewPicture from "./PreviewPicture.vue";

export default class preview {
  mounttag: HTMLBodyElement;
  app: App<Element>;
  options: any;

  constructor() {
    this.mounttag = document.querySelector("body");
  }

  mount(imgList: any[], options?: any) {
    options = options ?? this.options ?? {};

    this.app = createApp(PreviewPicture, {
      imgList,
      options,
      unmount: this.unmount,
    });

    this.app.mount(this.mounttag);
  }
  unmount(backCall?: Function) {
    this.app.unmount();
    backCall?.();
  }
}
