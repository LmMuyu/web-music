import { useStore } from "vuex";
import type { Store } from "vuex";
import type { State } from "../store/type";

export const getStore = (): Store<State> => useStore();
