import { isType } from "../utils/methods";

interface Binding {
  value: string;
}

type BGCOLOR = string | Array<string> | Object;

function mouseEnter(el?: HTMLElement, value?: string) {
  if (value && !value?.startsWith("#")) value = "#" + value;

  el && (el.style.backgroundColor = value || "#000");
}

function mouseLeave(el?: HTMLElement) {
  el && (el.style.backgroundColor = "#fff");
}

class hover {
  readonly name: string;

  constructor() {
    this.name = "hover";
  }

  retBgcolor(bgcolor: BGCOLOR) {
    if (isType(bgcolor) === "Array") {
      return (bgcolor as string[]).reduce((pre, cur) => {
        
        return;
      }, "");
    }
  }

  beforeMount() {}
  // console.error("ErrorType: binding.value No 'string' type");
  mounted(el: HTMLElement, binding: Binding) {
    const value = binding.value;

    el.addEventListener("mouseenter", mouseEnter.bind(this, el, binding.value));
    el.addEventListener("mouseleave", mouseLeave.bind(this, el));
  }
  beforeUnmount(el: HTMLElement) {
    el.removeEventListener("mouseenter", mouseEnter.bind(this, el, ""));
    el.removeEventListener("mouseleave", mouseLeave.bind(this, el));
  }
}

export default new hover();
