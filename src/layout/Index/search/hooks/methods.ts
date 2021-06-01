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
  blur = blur ? blur : false;
  showBar(blur);
}
