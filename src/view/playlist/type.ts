import type { Ref } from "@vue/reactivity";

export interface MatchItem {
  top: number;
  lyc: string;
  playTime: number;
  node?: Ref<Element> | null;
}
