export default function mouse(el: HTMLElement) {
  console.log(el);
  
  el.addEventListener("mousedown", mouseDown, true);

  function mouseDown(el: MouseEvent) {
    const node = el?.target as HTMLElement;

    node.addEventListener("mousemove", mouseMove, true);
    node.addEventListener(
      "mouseup",
      () => {
        console.log(3);

        node.removeEventListener("mousemove", mouseMove);
      },
      true
    );
  }

  function mouseMove(el: MouseEvent) {
    console.log(el);
  }
}
