import { useStorage } from "./useStorage";

export function useLocalStorage(key: string, value: string = "") {
  const isGet = !!value ? false : true;

  return useStorage(key, value, "local", {
    isGet,
  });
}
