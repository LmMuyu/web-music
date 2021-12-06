import { App, createApp } from "@vue/runtime-dom";
import { ref, Ref, watch } from "vue";

import PreviewPicture from "./PreviewPicture.vue";

import type { globalRefType } from "../../type";

export default class preview {
  mountDom: HTMLElement;
  app: Ref<App<Element> | null> = ref(null);
  options: any;
  previewList: Ref<any[]>;
  listViewPipe: (data: globalRefType<any>) => void;
  private index: number;

  constructor(imagelist: Ref<any[]>, defaultIndex: number) {
    this.previewList = imagelist;
    this.index = defaultIndex;
  }

  private runCreateApp(index: number, options: any) {
    this.app.value = createApp(PreviewPicture, {
      index,
      options,
      previewList: this.previewList,
      unmount: this.unmount.bind(this, false),
    });
  }

  mount(options?: any) {
    if (this.app.value) {
      return;
    }

    options = options ?? this.options ?? {};

    this.insertNode();
    this.runCreateApp(this.index, options);
    this.app.value.mount(this.mountDom);
  }

  unmount(iscomp: boolean) {
    if (!iscomp) {
      this.removeNode();
      return;
    }

    if (this.app.value === null) return;

    this.app.value.unmount();
    this.app = this.mountDom = null;
  }

  private insertNode() {
    this.mountDom = document.createElement("div");
    document.querySelector("body").appendChild(this.mountDom);
  }

  private removeNode() {
    this.previewList.value.length = 0;
    this.mountDom.parentNode.removeChild(this.mountDom);
  }
}
