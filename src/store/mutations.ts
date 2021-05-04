import { reactive } from "@vue/reactivity";
import { State, UserInfo } from "./type";

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },
  setUserInfo(state: State, commitInfo: UserInfo) {
    state.userInfo = reactive<UserInfo>(commitInfo);

    console.log(state);
  },
};
