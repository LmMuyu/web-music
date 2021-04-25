import { ComponentInternalInstance } from "@vue/runtime-core";

export function getStore(instance: ComponentInternalInstance) {
  return instance?.appContext.config.globalProperties.$store;
}
