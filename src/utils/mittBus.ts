import { getCurrentInstance } from "vue";
import type { Emitter } from "mitt";

export function getMittBus() {
  const { proxy } = getCurrentInstance()!;
  //@ts-ignore
  const mittBus = proxy.mittBus as Emitter;

  return mittBus;
}
