import { createStore } from "vuex";
import actions from "./actions";
import getters from "./getters";
import modules from "./modules";
import mutations from "./mutations";

export interface State {
  countriesCode: Record<string, any>;
}

const store = createStore<State>({
  state() {
    return {
      countriesCode: {},
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
