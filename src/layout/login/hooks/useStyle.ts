import { computed, ref } from "vue";

export function useStyle() {
  const style = ref({});

  const returnStyleOptions = computed(() => {
    return { ...style.value };
  });

  return {
    style,
    returnStyleOptions,
  };
}
