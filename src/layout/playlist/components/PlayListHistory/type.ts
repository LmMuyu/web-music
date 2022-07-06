export type Include<T, K extends keyof T> = { [P in K]: T[P] };

export interface OPTIONS {
  total: number;
  size: number;
}
