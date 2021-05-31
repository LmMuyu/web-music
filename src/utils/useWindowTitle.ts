import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export function useWindowTitle(value: string = "") {
  const title = ref(value);

  watch(
    title,
    (value) => {
      if (!!value) {
        document.title = value;
      }
    },
    {
      immediate: true,
    }
  );

  return title;
}
