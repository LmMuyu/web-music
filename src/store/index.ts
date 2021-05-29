import { createStore } from "vuex";

import actions from "./actions";
import getters from "./getters";
import modules from "./modules";
import mutations from "./mutations";

import { findLoginInfo } from "./methods";

import type { State } from "./type";

const store = createStore<State>({
  state() {
    return {
      countriesCode: null,
      userInfo: findLoginInfo(),
      musicInfo: null,
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
