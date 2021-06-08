import { shallowRef } from "@vue/reactivity";
import { createAsComponent } from "../../../../utils/createAsComponent";

const Discover = createAsComponent("/layout/Index/discover/Discover.vue");
const Toplist = createAsComponent("/layout/Index/toplist/Toplist.vue");

const TopListAsideTag = createAsComponent(
  "/layout/Index/toplist/components/TopListAsideTag.vue"
);
const DiscoverBar = createAsComponent(
  "/layout/Index/discover/components/DiscoverBar.vue"
);

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
    console.log(this.type);

    if (this.type == "root") {
      const name = compName[0];
      console.log(this);

      // this.switchComps.call(this, name);
    } else {
      console.log(this);
      const name = compName[1];
      // this.switchComps.call(this, name);
    }
  }

  switchComps(name: string) {
    if (!this.compsMap.has(name)) return;

    const comp = this.compsMap.get(name);
    this.componentId.value = comp;
  }
}

export const { componentId, putView } = new controlComps(
  [
    ["Discover", Discover],
    ["Toplist", Toplist],
  ],
  "Discover",
  "root"
);

export const { componentId: compsId, putView: switchView } = new controlComps(
  [
    ["TopListAsideTag", TopListAsideTag],
    ["DiscoverBar", DiscoverBar],
  ],
  "DiscoverBar",
  "children"
);
