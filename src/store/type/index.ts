export interface State {
  countriesCode: Record<string, any>;
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
  token: string;
  tokenJsonStr: TokenJsonStr;
  userInfoData?: Object;
}
