import { computed, ref } from "vue";

export function useTranslate(node: HTMLElement, direction: "left" | "right") {
  const direc = direction.trim();
  const directionvlaue = direc === "left" ? -200 : 200;
  const x = ref(directionvlaue);

  const onEnter = () => {
    x.value = 0;
  };

  const onLeave = () => {
    x.value = directionvlaue;
  };

  node.addEventListener("mouseenter", onEnter, false);
  node.addEventListener("mouseleave", onLeave, false);

  function unMountEvent() {
    node.removeEventListener("mouseenter", onEnter, false);
    node.removeEventListener("mouseleave", onLeave, false);
  }

  const translateX = computed(() => {
    return {
      transition: "all .5s ease",
      transform: `translateX(${x.value}%)`,
    };
  });

  return {
    translateX,
    unMountEvent,
  };
}
