import { createStore } from "vuex";
import { ref } from "@vue/runtime-dom";
import mitt from "mitt";

import actions from "./actions";
import getters from "./getters";
import modules from "./modules";
import mutations from "./mutations";

import type { State } from "./type";

const store = createStore<State>({
  state() {
    return {
      countriesCode: null,
      musicInfo: null,
      activeTagFn: null,
      circleRef: ref(true),
      mainTagsShow: true,
      unmountList: mitt(),
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
