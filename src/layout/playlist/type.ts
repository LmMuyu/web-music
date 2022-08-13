import type { Ref } from "@vue/reactivity";

export interface MatchItem {
  lyc: string;
  playTime: number;
  indexId: number;
  originTime: string;
}

export type MatchItemList = Ref<Map<number, MatchItem>>;
