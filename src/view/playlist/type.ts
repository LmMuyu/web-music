import type { Ref } from "@vue/reactivity";

export interface MatchItem {
  lyc: string;
  node?: Ref<Element> | null;
  playTime: number | string;
}
