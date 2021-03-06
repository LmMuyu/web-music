import type { Ref } from "vue";

export interface dayAttribute {
  $D: number;
  $H: number;
  $L: string;
  $M: number;
  $W: number;
  $d: string;
  $m: number;
  $ms: number;
  $s: number;
  $u: undefined;
  $x: Object;
  $y: number;
}

export type globalRefType<T> = Ref<T[]> | T[] | T;
