import { countries } from "../api/app/requestMain";
import { getUserInfoData } from "../api/app/userInfo";

import type { UserInfo } from "./type";

type Commit = (type: string, payload?: any, options?: Object) => void;

export default {
  async countriesCode(context: { commit: (arg0: string, arg1: any) => void }) {
    try {
      const { data } = await countries();

      context.commit("countriesCode", data);
    } catch (err) {
      console.log(err);
    }
  },
  async getUserInfo(state: { commit: Commit }, userinfoData: UserInfo) {
    if (!userinfoData) {
      return;
    }

    const infoData = await getUserInfoData(userinfoData.userID);
    userinfoData.userInfoData = infoData.data.profile;

    state.commit("setUserInfo", userinfoData);
  },
};
