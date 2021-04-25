import { Directive } from "@vue/runtime-core";
import fastdom from "fastdom";
import { isType } from "../utils/methods";

type DomList = string | string[] | Element | Element[];
interface ElementList {
  ID: number;
  scrollTop: number;
  node: Element;
}

function isElement(element: any) {
  if (
    typeof element === "object" &&
    element.nodeType === 1 &&
    typeof element.nodeName === "string"
  ) {
    return true;
  } else {
    return false;
  }
}

class methods {
  binarySearch(listElement: ElementList[], value: number) {
    let start = 0;
    let end = listElement.length - 1;
    let midIndx = 0;
    let midAttriKey = 0;
    let midNode: ElementList | null = null;

    while (start <= end) {
      midIndx = (start + end) >>> 1;
      midAttriKey = listElement[midIndx].ID!;

      if (value === midAttriKey) {
        return (midNode = listElement[midIndx]);
      } else if (value < midAttriKey) {
        start += 1;
      } else if (value > midAttriKey) {
        end -= 1;
      }
    }

    return midNode;
  }
}

class storeMap extends methods {
  map: Map<string, ElementList[]>;
  indexID: number;

  constructor() {
    super();
    this.map = new Map();
    this.indexID = 0;
  }

  getmap(key: string, value?: Element) {
    if (!isElement(value)) {
      return console.error(value + "不是Element元素");
    }

    if (this.map.has(key)) {
      if (value) {
        const entries = this.map.get(key);
        if (!entries) return;

        const vaEl = value.getAttribute("index-key")!;
        return this.binarySearch(entries, parseInt(vaEl));
      } else {
        return this.map.get(key);
      }
    }
  }

  setmap(key: string, value: DomList) {
    let list = this.map.has(key) ? this.map.get(key) : this.map.set(key, []);

    if (typeof value === "string") {
      const first = value.substring(0, 1);
      if (first == "#" || first == ".") {
        const node = document.querySelector(value);

        if (node) {
          node.setAttribute("index-key", String(this.indexID));
          let scrollTop: number = 0;

          fastdom.mutate(() => {
            scrollTop = node.scrollTop;
          });

          const nodeOption: ElementList = {
            ID: this.indexID,
            scrollTop,
            node,
          };

          if (Array.isArray(list)) {
            list?.push(nodeOption);
          } else if (isType(list) === "Map") {
            const map = list?.get(key);
            map?.push(nodeOption);
          }

          this.indexID += 1;
        }
      }
    } else if (isType(value) === "Array" && typeof value[0] === "string") {
    }
  }
}

const directives: Directive = {
  created(bounding) {
    console.log(bounding);
  },
  mounted(el, bounding) {},
};

export default directives;
