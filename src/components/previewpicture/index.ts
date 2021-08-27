import { App, createApp } from "@vue/runtime-dom";
import { isRef, ref, Ref, unref, watch } from "vue";

import PreviewPicture from "./PreviewPicture.vue";

import type { globalRefType } from "../../type";

export default class preview {
  mounttag: HTMLElement;
  app: Ref<App<Element> | null> = ref(null);
  options: any;
  previewList: Ref<any[]>;
  listViewPipe: (data: globalRefType<any>) => void;

  private runCreateApp(index: number, options: any) {
    const stop = watch(this.app, (value) => {
      this.listViewPipe = value.config.globalProperties.listViewPipe;
      stop();
    });

    this.app.value = createApp(PreviewPicture, {
      index,
      options,
      previewList: this.previewList.value,
      unmount: this.unmount.bind(this, false),
    });
  }

  mount(imgList: Ref<any[]> | any[], index: number, options?: any) {
    if (!!this.app.value) {
      this.addNode(imgList);
      return;
    }

    options = options ?? this.options ?? {};
    this.previewList = isRef(imgList) ? imgList : ref(imgList);

    this.findNode();
    this.runCreateApp(index, options);
    this.app.value.mount(this.mounttag);
  }

  unmount(iscomp: boolean) {
    if (!iscomp) {
      this.removeNode();
      return;
    }

    if (this.app.value === null) return;

    this.app.value.unmount();
    this.mounttag = null;
    this.app = null;
    return true;
  }

  private findNode() {
    this.mounttag = document.createElement("div");
    document.querySelector("body").appendChild(this.mounttag);
  }

  private addNode(imageList: Ref<any[]> | any[]) {
    const list = unref(imageList);
    if (!list.length) return;

    this.listViewPipe(list);
    document.querySelector("body").appendChild(this.mounttag);
  }

  private removeNode() {
    this.previewList.value.length = 0;
    this.mounttag.parentNode.removeChild(this.mounttag);
  }
}
