import { ref, watch } from "vue";

export default function useWatch(watchobj: any) {
  watchobj = typeof watchobj === "object" ? () => watchobj : watchobj;

  const value = ref();
  const stopWatch = watch(watchobj, (data) => {
    value.value = data;
    console.log(data);
  });

  return {
    stopWatch,
    value,
  };
}
