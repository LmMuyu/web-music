import { App, createApp } from "@vue/runtime-dom";
import PromptBox from "./PromptBox.vue";

interface options {
  mountNode?: string | HTMLElement;
  delay?: number;
  title: string;
  success?: Function;
}

export function promptbox(option: options) {
  option.mountNode = option.mountNode || "#promptbox";
  option.delay = option.delay || 3000;

  function createapp() {
    const promptbox = createApp(PromptBox, {
      title: option.title,
    });

    return promptbox;
  }

  let instance: null | App<Element> = createapp();
  let div = document.createElement("div");
  let mountNode =
    option.mountNode instanceof HTMLElement
      ? option.mountNode
      : document.querySelector(option.mountNode);

  mountNode.appendChild(div);

  instance.mount(option.mountNode);

  let timer: number | null = null;

  timer = setTimeout(() => {
    instance && instance.unmount();
    instance = null;
    mountNode.removeChild(div);
    mountNode = null;
    div = null;
    option.success?.();

    clearTimeout(timer!);
    timer = null;
  }, option.delay);

  return true;
}
