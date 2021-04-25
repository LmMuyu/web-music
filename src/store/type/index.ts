export interface State {
  countriesCode: Record<string, any>;
  userInfo: UserInfo;
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
  id: string;
  token: string;
  tokenJsonStr: TokenJsonStr;
}
