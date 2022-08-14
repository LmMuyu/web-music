import { Ref, ref, watchEffect } from "vue";

export default function useColSpan(ls: Ref<any[]>) {
  const LIMIT_MAX = 24;
  const eachspan = ref(0);

  const stop = watchEffect(() => {
    if (ls.value.length) {
      eachspan.value = Math.floor(LIMIT_MAX / ls.value.length);
    }
  });

  return {
    stop,
    eachspan,
  };
}
