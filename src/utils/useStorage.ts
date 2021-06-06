import { ref } from "@vue/reactivity";

interface Options {
  isGet: boolean;
}

export function useStorage(
  key: string,
  value: string = "",
  mode: "local" | "sess",
  options: Options
) {
  const data = ref(value);

  const storeage =
    mode === "local" ? window.localStorage : window.sessionStorage;
  const { isGet = false } = options;

  function read() {
    const defaultValue = storeage.getItem(key);

    try {
      if (!defaultValue && !!value && !isGet) {
        storeage.setItem(key, value);
      } else {
        data.value = defaultValue || "";
      }
    } catch (err) {
      console.log(err);
    }
  }

  read();

  return data;
}
