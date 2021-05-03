let isclass: boolean | null = null;

export function onMouseenter(e: MouseEvent) {
  let htmlel = e.target as HTMLElement;
  isclass = htmlel.classList.contains("bg-gray-300");

  if (!isclass) {
    htmlel.classList.add("bg-gray-100");
  }
}
export function onMouseleave(e: MouseEvent) {
  let htmlel = e.target as HTMLElement;

  if (!isclass) {
    htmlel.classList.remove("bg-gray-100");
  }
}
