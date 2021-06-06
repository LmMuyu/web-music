import { useStorage } from "./useStorage";

export function useLocalStorage(key: string, value: string = "") {
  return useStorage(key, value, "local", {
    isGet: false,
  });
}
