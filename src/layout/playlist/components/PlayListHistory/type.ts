import type { Ref } from "vue";

export type Include<T, K extends keyof T> = { [P in K]: T[P] };

export interface OPTIONS {
  total: Ref<number>;
  size: number;
}
