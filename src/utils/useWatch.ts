import { ref, watch, isRef } from "vue";

export default function useWatch(watchobj: any) {
  if (!isRef(watchobj)) {
    watchobj = typeof watchobj === "object" ? () => watchobj : watchobj;
  }

  const value = ref();
  const stopWatch = watch(watchobj, (data) => {
    value.value = data;
  });

  return {
    stopWatch,
    value,
  };
}
