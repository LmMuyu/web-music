import { ref, unref } from "@vue/reactivity";
import type { Ref } from "@vue/reactivity";

export function useRrfNegate(count: Ref<boolean> | boolean) {
  const num = unref(count);

  const countRef = ref(num);

  function negate() {
    countRef.value = !countRef.value;
  }

  return {
    countRef,
    negate,
  };
}
