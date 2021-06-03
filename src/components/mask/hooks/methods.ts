import { computed } from "@vue/runtime-core";

export function nodeRoot(node: string) {
  const tonode = computed(() => {
    const root = node;

    if (root.startsWith("#" || root.startsWith("."))) {
      const node = document.querySelector(root);
      return node ? root : "#app";
    } else {
      return "#app";
    }
  });

  return tonode;
}
