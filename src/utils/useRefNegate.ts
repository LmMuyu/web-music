import { ref, isRef } from "@vue/reactivity";
import type { Ref } from "@vue/reactivity";

export function useRefNegate(form: Ref<boolean> | boolean) {
  const countRef = isRef(form) ? form : ref(form);

  function negate() {
    countRef.value = !countRef.value;
    return true;
  }

  return {
    countRef,
    negate,
  };
}
