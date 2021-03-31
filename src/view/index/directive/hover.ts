import { Directive } from "vue";

export default (): Directive => {
  function mouseEnter() {
    return (node?: MouseEvent) => {
      console.log(node);
    };
  }

  return {
    mounted(el: HTMLElement) {
      el.addEventListener("mouseenter", mouseEnter(), false);
    },
    unmounted(_el: HTMLElement) {
      _el.removeEventListener("mouseenter", mouseEnter());
    },
  };
};
