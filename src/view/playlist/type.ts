import type { Ref } from "@vue/reactivity";

export interface MatchItem {
  top: number;
  lyc: string;
  indexId: number;
  playTime: number;
  node?: Ref<Element> | null;
}

export type MatchItemList = Ref<Map<number, MatchItem>>;
