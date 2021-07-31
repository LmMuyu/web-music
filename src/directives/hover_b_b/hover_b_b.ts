import path from "path";
import fs from "fs";

import type { Directive } from "vue";

export async function setHover() {
  // console.log(path.join(__dirname, "/src/directives/hover_b_b/css.css"));
  console.log(import.meta.url);

  const hover_b_b: Directive & {
    setConstructor: (name: string, color: string) => void;
  } = {
    setConstructor(name: string = "hover_b_b", color: string) {
      this.defaultColor = color;
      this.name = name;
    },
  };

  return hover_b_b;
}
