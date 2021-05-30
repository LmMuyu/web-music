import { ref } from "@vue/reactivity";

export function useStorage(key: string, value: string = "", mode: string) {
  const data = ref(value);

  const storeage =
    mode === "local" ? window.localStorage : window.sessionStorage;

  function read() {
    const defaultValue = storeage.getItem(key);

    try {
      if (!defaultValue && !!value) {
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
