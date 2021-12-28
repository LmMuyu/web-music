import type { RouteLocationNormalized } from "vue-router";
import type { MusicDetailOption } from "../../utils/musicDetail";
import type { Ref } from "vue";
import type { Emitter } from "mitt";

export interface State {
  countriesCode: null | Array<Record<string, any>>;
  musicInfo: null | MusicDetailOption;
  circleRef: Ref<boolean>;
  activeTagFn: (to: RouteLocationNormalized) => void | null;
  mainTagsShow: boolean;
  unmountList: Emitter;
}

export interface ALLTOKEN {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  expried: boolean;
  nickname: string;
  unionid: string;
  openid: string;
}

export interface USERDATA {
  userID: number;
  id: number;
  nickname: string;
  avatarUrl: string;
  userinfoData?: Record<string, any>;
}
