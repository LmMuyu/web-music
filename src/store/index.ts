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
      userInfo: null,
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
