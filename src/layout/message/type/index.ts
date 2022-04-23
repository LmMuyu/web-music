import * as Factory from "../hook/factory";

export interface PRIVATEPROPLEL_AND_ETTER {
  propleInfo: Record<string, any>;
  totals: Array<Record<string, any>>;
}

export type deepReadonlyFocus<T extends Record<string, any>, K extends keyof T> = {
  [P in K]: T[P];
};

export type SendLetterInfoEmit = deepReadonlyFocus<Factory.FocusTheUser, "lastTime"> &
  deepReadonlyFocus<Factory.User, "uid" | "avatar" | "nickname">;

export interface LetterMes {
  msg: string;
  type: number;
  title: string;
}
