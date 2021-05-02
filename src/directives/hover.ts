import { isType } from "../utils/methods";
import type { HoverOption } from "../layout/Index/toplist/types/components";
import { nextTick } from "@vue/runtime-core";

type BGCOLOR = string | Array<HoverOption> | HoverOption;

interface Binding {
  value: BGCOLOR;
}

class hover {
  readonly name: string;
  value: BGCOLOR | null;
  readonly styleMap: Map<HTMLElement, Record<string, string>>;

  constructor() {
    this.name = "hover";
    this.styleMap = new Map();
    this.value = null;
  }

  setEl(el: HTMLElement, eloption: HoverOption) {
    eloption.el = el;
    return el;
  }

  rawStyles(el: HTMLElement) {
    const styleMap = this.styleMap.get(el);
    const stylesObj = styleMap ? styleMap : this.styleMap.set(el, {}).get(el)!;
    const computedStyle = window.getComputedStyle(el);

    return function styleMap(keyItme: any) {
      const rewStyle = computedStyle[keyItme];

      if (rewStyle) {
        stylesObj[keyItme] = rewStyle;
      }
    };
  }

  setStyle(eloption: HoverOption, el?: HTMLElement) {
    // if (value && !value?.startsWith("#")) value = "#" + value;
    const styles = eloption.styles;
    const curEl = eloption.el ? eloption.el : this.setEl(el!, eloption);

    const rawstyleMap = this.rawStyles(curEl);

    for (const key in styles) {
      const keyItme = key as any;

      nextTick(() => {
        rawstyleMap(keyItme);
      });

      curEl && (curEl.style[keyItme] = styles[key]);
    }
  }

  bgcolor(bgcolor: BGCOLOR, el?: HTMLElement) {
    if (isType(bgcolor) === "Array") {
      (bgcolor as []).forEach((elItem: HoverOption) => {
        this.setStyle(elItem, el);
      });
    } else if (isType(bgcolor) === "Object") {
      this.setStyle(bgcolor as HoverOption, el);
    } else if (typeof bgcolor === "string") {
      el && (el.style.backgroundColor = bgcolor);
    } else {
      return;
    }
  }

  hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
          result[3],
          16
        )})`
      : null;
  }

  mouseEnter(value: BGCOLOR, el?: HTMLElement) {
    this.bgcolor(value, el);
  }

  mouseLeave() {
    const styleMap = this.styleMap.entries();

    if (isType(styleMap) === "Array") {
      for (const [keyEl, styles] of styleMap) {
        this.setStyle({
          el: keyEl,
          styles: {
            ...styles,
          },
        });
      }
    }
  }

  mounted(el: HTMLElement, binding: Binding) {
    const value = binding.value;
    if (!value) return;
    this.value = value;
    
    el.addEventListener("mouseenter", this.mouseEnter.bind(this, value, el));
    el.addEventListener("mouseleave", this.mouseLeave.bind(this, el));
  }
  beforeUnmount(el: HTMLElement) {
    el.removeEventListener("mouseenter", this.mouseEnter.bind(this, [], el));
    el.removeEventListener("mouseleave", this.mouseLeave.bind(this, el));
  }
}

export default new hover();
