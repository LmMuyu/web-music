import { State, UserInfo } from "./type";

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },
  setUserInfo(state: State, commit: UserInfo) {
    console.log(commit);
    
    // state.userInfo.id = commit.id;
    // state.userInfo.token = commit.token;
    // state.userInfo.tokenJsonStr = commit.tokenJsonStr;
  },
};
