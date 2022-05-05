import store from "../store";

import type { State } from "../store/type";
import type { Store } from "vuex";

export const getStore = (): Store<State> => store;
