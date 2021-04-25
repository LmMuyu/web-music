import { reactive } from "@vue/reactivity";
import { createStore } from "vuex";
import actions from "./actions";
import getters from "./getters";
import modules from "./modules";
import mutations from "./mutations";

import type { State, UserInfo } from "./type";

const store = createStore<State>({
  state() {
    return {
      countriesCode: {},
      userInfo: reactive<UserInfo>({
        id: "",
        token: "",
        tokenJsonStr: {
          refresh_token: "",
          access_token: "",
          expires_inv: "",
          nickname: "",
          unionid: "",
          openid: "",
        },
      }),
    };
  },
  getters,
  actions,
  mutations,
  modules,
  strict: true,
  devtools: true,
});

export default store;
