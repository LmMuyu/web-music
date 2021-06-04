import { ref } from "@vue/reactivity";

export function useStorage(
  key: string,
  value: string = "",
  mode: "local" | "sess",
  options: Record<string, string>
) {
  const data = ref(value);

  const storeage =
    mode === "local" ? window.localStorage : window.sessionStorage;
  const isGet = options?.isGet || "0";

  function read() {
    const defaultValue = storeage.getItem(key);

    try {
      if (!defaultValue && !!value && !(isGet === "1")) {
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
