import { ComputedRef, ref, Ref } from "@vue/reactivity";
import { onUnmounted, watch } from "@vue/runtime-core";
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
