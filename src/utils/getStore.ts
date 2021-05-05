import { ComponentInternalInstance } from "@vue/runtime-core";
import type { Store } from "vuex";
import type { State } from "../store/type";

export function getStore(instance: ComponentInternalInstance): Store<State> {
  return instance?.appContext.config.globalProperties.$store;
}
