import { ComputedRef, ref, Ref } from "@vue/reactivity";
import { onUnmounted, watch } from "@vue/runtime-core";
import { isType } from "../../../../utils/methods";
import { MusicDetailOption, typeSinger } from "../../../../utils/musicDetail";
import { showTheBar } from "./data";

export function returnResData(keyword: string, data: Record<string, any>[]) {
  showTheBar.keyword = keyword;
  showTheBar.renderData = data;

  setTimeout(() => {
    showBar(!showTheBar.showBar, keyword);
  });
}

export const showBar = (show: boolean, keyword: string = "") => {
  if (showTheBar.showBar && keyword !== "") return;

  showTheBar.showBar = show;
};

export function onBlur(blur: boolean) {
  console.log(444);

  blur = blur ? blur : false;
  showBar(blur);
}

const listInfoAr = ["ar", "creator"];

function singerOptions(data: any) {
  if (!data) return [];
  return isType(data) !== "Array" ? [data] : data;
}

export class resultOptions implements MusicDetailOption {
  id: number;
  name: string;
  picUrl: string;
  ar: typeSinger;

  constructor(options: Record<string, any>) {
    this.id = this.getID(options, options.type);
    this.name = this.getName(options);
    this.picUrl = this.getPicUrl(options);
    this.ar = this.getAr(options);
  }

  getID(options: any, type: string) {
    const id = options.id || options.vid;

    if (!id) {
      throw new Error(`${type}:找不到对应id`);
    }

    return id;
  }

  getName(options: any): string {
    return options.name || options.title;
  }

  getPicUrl(options: any) {
    return options.coverUrl || options.coverImgUrl || options["al"]["picUrl"];
  }

  getAr(options: any) {
    let singerInfoOption = {};

    for (let i = 0; i < listInfoAr.length; i++) {
      const item = options[listInfoAr[i]];

      if (item) {
        singerInfoOption = item;
        break;
      }
    }

    return singerOptions(singerInfoOption);
  }
}

export function mainContentHeight(
  node: Ref<HTMLElement | null>,
  column: ComputedRef<number>,
  eachColH: Ref<number>
) {
  const stop = watch(
    column,
    (value) => {
      if (!node.value || !value) return 0;

      const mainNode = node.value;
      const height = mainNode.clientHeight;
      const colH = Math.round(height / value);

      eachColH.value = colH;
    },
    {
      immediate: true,
    }
  );

  onUnmounted(() => stop());
}
