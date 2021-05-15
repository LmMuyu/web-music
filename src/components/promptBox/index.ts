import { App, createApp } from "@vue/runtime-dom";
import PromptBox from "./PromptBox.vue";

interface options {
  mountNode?: string;
  delay?: number;
  title: string;
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

  instance.mount(option.mountNode);

  let timer: NodeJS.Timeout | null = null;

  timer = setTimeout(() => {
    instance && instance.unmount();
    instance = null;

    clearTimeout(timer!);
    timer = null;
  }, option.delay);
}
