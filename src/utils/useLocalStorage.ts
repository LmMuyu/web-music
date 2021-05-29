import { ref } from "@vue/reactivity";

export function useLocalStorage(key: string, value: string) {
  const data = ref(value);

  function read() {
    const defaultValue = localStorage.getItem(key);

    try {
      if (!defaultValue) {
        localStorage.setItem(key, value);
      } else {
        data.value = defaultValue;
      }
    } catch (err) {
      console.log(err);
    }
  }

  read()

  window.addEventListener("storage", read, false);

  return data;
}
