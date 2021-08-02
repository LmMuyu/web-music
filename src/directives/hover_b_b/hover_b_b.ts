import stylecss from "./css.css";

import type { Directive } from "vue";

export async function setHover() {
  const hover_b_b: Directive & {
    setConstructor: (name: string, color: string) => void;
  } = {
    setConstructor(name: string = "hover_b_b", color: string) {
      this.defaultColor = color;
      this.name = name;
    },
    // beforeMount(el, binding) {
    //   console.log(el, bind);
    // },
  };

  return hover_b_b;
}
