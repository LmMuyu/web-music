import { App, createApp } from "@vue/runtime-dom";
import { isRef, ref, Ref, unref } from "vue";
import PreviewPicture from "./PreviewPicture.vue";

export default class preview {
  mounttag: HTMLElement;
  app: App<Element>;
  options: any;
  previewList: Ref<any[]>;

  private runCreateApp(index: number, options: any) {
    this.app = createApp(PreviewPicture, {
      index,
      options,
      previewList: this.previewList.value,
      unmount: this.unmount.bind(this, false),
    });
  }

  mount(imgList: Ref<any[]> | any[], index: number, options?: any) {
    if (!!this.app) {
      this.addNode(imgList);
      return;
    }

    options = options ?? this.options ?? {};
    this.previewList = isRef(imgList) ? imgList : ref(imgList);

    this.findNode();
    this.runCreateApp(index, options);
    this.app.mount(this.mounttag);
  }

  unmount(iscomp: boolean) {
    if (!iscomp) {
      this.removeNode();
      return;
    }

    this.app.unmount();
    this.mounttag.parentNode.removeChild(this.mounttag);
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

    this.imageListPipe(list);
    document.querySelector("body").appendChild(this.mounttag);
  }

  private removeNode() {
    this.previewList.value.length = 0;
    this.mounttag.parentNode.removeChild(this.mounttag);
  }

  private imageListPipe(imgList: any[]) {
    this.previewList.value.length = 0;
    this.previewList.value = imgList;
    console.log(this.previewList.value);
  }
}
