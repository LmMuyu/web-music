interface CuntriesCode {
  data: Array<Record<string, any>>;
}

export interface State {
  countriesCode: CuntriesCode;
  userInfo: null | UserInfo;
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
  userInfoData?: Object;
}
