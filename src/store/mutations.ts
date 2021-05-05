import { reactive } from "@vue/reactivity";
import { State, UserInfo } from "./type";

function setLocalStorageToken(token: number) {
  if (!token) {
    return;
  }

  localStorage.setItem("token", token + "");
}

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },
  setUserInfo(state: State, commitInfo: UserInfo) {
    Promise.resolve(() => setLocalStorageToken(commitInfo.token));
    state.userInfo = reactive<UserInfo>(commitInfo);
  },
};
