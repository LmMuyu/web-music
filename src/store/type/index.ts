import type { RouteLocationNormalized } from "vue-router";
import type { MusicDetailOption } from "../../utils/musicDetail";

export interface State {
  countriesCode: null | Array<Record<string, any>>;
  musicInfo: null | MusicDetailOption;
  activeTagFn: (to: RouteLocationNormalized) => void | null;
}

export interface TokenJsonStr {
  access_token: string;
  refresh_token: string;
  unionid: string;
  openid: string;
  nickname: string;
  expires_inv: string;
}

export interface UserInfo {
  userID: number;
  id: number;
  token: number;
  tokenJsonStr: TokenJsonStr;
  userinfoData?: Record<string, any>;
}
