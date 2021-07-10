import { shallowRef } from "@vue/reactivity";
import { createAsComponent } from "../../../utils/createAsComponent";

console.log(import.meta.globEager("../../../layout"));

const Discover = createAsComponent(
  () => import("../../../layout/Index/discover/Discover.vue")
);

const Toplist = createAsComponent(
  () => import("../../../layout/Index/toplist/Toplist.vue")
);

const ExploreContent = createAsComponent(
  () => import("../../../layout/explore/explorecontent/ExploreContent.vue")
);

const TopListAsideTag = createAsComponent(
  () => import("../../../layout/Index/toplist/components/TopListAsideTag.vue"),
  {
    loadComp: false,
  }
);

const DiscoverBar = createAsComponent(
  () => import("../../../layout/Index/discover/components/DiscoverBar.vue"),
  {
    loadComp: false,
  }
);

const ExploreRight = createAsComponent(
  () => import("../../../layout/explore/exploreright/ExploreRight.vue"),
  {
    loadComp: false,
  }
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
    if (this.type == "root") {
      const name = compName[0];
      this.switchComps.call(this, name);
    } else {
      const name = compName[1];
      this.switchComps.call(this, name);
    }
  }

  switchComps(name: string) {
    if (!name || !this.compsMap.has(name)) return;

    const comp = this.compsMap.get(name);
    this.componentId.value = comp;
  }
}

const controlView = new controlComps(
  [
    ["Discover", Discover],
    ["Toplist", Toplist],
    ["ExploreContent", ExploreContent],
  ],
  "Discover",
  "root"
);

const controlViewChildren = new controlComps(
  [
    ["TopListAsideTag", TopListAsideTag],
    ["DiscoverBar", DiscoverBar],
    ["ExploreRight", ExploreRight],
  ],
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
