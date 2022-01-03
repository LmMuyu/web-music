import { Ref } from "vue";
import { useStorage } from "./useStorage";

export function useLocalStorage(key: string, value?: any): Ref<any> {
  const isGet = value ? false : true;
  return useStorage(key, value, "local", { isGet });
}
