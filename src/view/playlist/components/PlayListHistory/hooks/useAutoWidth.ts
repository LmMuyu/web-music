import { computed } from "vue";

export const itemWidth = computed(() => {
  const fontSize = window
    .getComputedStyle(document.body)
    .fontSize.match(/\d+/g)
    ?.map(Number)[0];

  return function (node?: HTMLElement) {
    console.log(node);
  };
});
