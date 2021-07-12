import { shallowRef } from "@vue/reactivity";

import { createAsComponent } from "../../../utils/createAsComponent";
import { importCompsList } from "./data";

const moduleFile = import.meta.glob("../../../layout/**");
const controlViewComps = [];
const controlViewChildrenComps = [];

for (const key in moduleFile) {
  const fileName = key.match(/\/(\w+|\d+)\.vue$/);

  if (fileName && importCompsList.has(fileName[1])) {
    const importPath = moduleFile[fileName.input];
    const compsOptions = importCompsList.get(fileName[1]);

    const asyncComps = createAsComponent(importPath, compsOptions.options);

    compsOptions.position === "main"
      ? controlViewComps.push([fileName[1], asyncComps])
      : controlViewChildrenComps.push([fileName[1], asyncComps]);
  }
}

class controlComps {
  private compsMap: Map<string, any>;
  componentId: any;
  type: string;

  constructor(
    comps: Array<Array<any>>,
    defaultView: string,
    type: "root" | "children"
  ) {
    this.compsMap = new Map();
    this.type = type;
    this.setComps(comps);

    this.componentId = shallowRef(this.compsMap.get(defaultView));
  }

  setComps(comps: Array<Array<any>>) {
    for (const [key, value] of comps) {
      if (!this.compsMap.has(key)) {
        this.compsMap.set(key, value);
      }
    }
  }

  putView(compName: string[]) {
    if (this.type == "root") {
      const name = compName[0];
      if (name) {
        this.switchComps.call(this, name);
      }
    } else {
      const name = compName[1];
      if (name) {
        this.switchComps.call(this, name);
      }
    }
  }

  switchComps(name: string) {
    if (!name || !this.compsMap.has(name)) return;

    const comp = this.compsMap.get(name);
    this.componentId.value = comp;
  }
}

const controlView = new controlComps(controlViewComps, "Discover", "root");

const controlViewChildren = new controlComps(
  controlViewChildrenComps,
  "DiscoverBar",
  "children"
);

export const { componentId, putView } = controlView;

export const { componentId: compsId, putView: switchView } =
  controlViewChildren;

export function runLoadView(compsStrList: string[]) {
  putView.call(controlView, compsStrList);
  switchView.call(controlViewChildren, compsStrList);
}
