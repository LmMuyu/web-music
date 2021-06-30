import { App } from "@vue/runtime-core";
import { createApp } from "@vue/runtime-dom";
import { useRefNegate } from "../../utils/useRefNegate";
import Loading from "./Loading.vue";

export class createLoading {
  private install: App<Element> | null = null;
  private root: HTMLElement | null = null;
  private div: HTMLDivElement;
  public negate: () => void;
  public countRef: any;

  public mountApp: (
    node: string | HTMLElement,
    backCall?: Function | undefined
  ) => any;
  public unmountApp: (backcall?: Function | undefined) => void;
  public isMountApp: () => boolean;

  constructor() {
    const { countRef, negate } = useRefNegate(false);
    this.div = document.createElement("div");
    this.div.classList.add(...["w-full", "h-full"]);

    this.install = null;
    this.root = null;
    this.countRef = countRef;
    this.negate = negate;
    this.mountApp = this.runMountApp();
    this.unmountApp = this.runUnmountApp();
    this.isMountApp = this.runIsMountApp();
  }

  private runMountApp() {
    return (node: string | HTMLElement, backCall?: Function) => {
      backCall?.();
      this.install = createApp(Loading);

      this.root =
        node instanceof HTMLElement ? node : document.querySelector(node);
      this.install.mount(this.div);
      this.root?.appendChild(this.div);

      return this.unmountApp;
    };
  }

  private runUnmountApp() {
    return (backcall?: Function) => {
      if (this.install) {
        this.install.unmount();
        this.root?.removeChild(this.div);
        this.root = this.install = null;
        backcall?.();
      }
    };
  }

  private runIsMountApp() {
    return () =>
      Object.prototype.toString
        .call(this.install)
        .match(/\[object (.+)\]/)?.[1] === "Object";
  }
}
