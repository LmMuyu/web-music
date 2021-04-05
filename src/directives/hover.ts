interface Binding {
  value: string;
}

class hover {
  readonly name: string;

  constructor() {
    this.name = "hover";
  }

  beforeMount() {}

  mounted(el: HTMLElement, binding: Binding) {
    function mouseEnter() {
      el.style.backgroundColor = binding.value || "#000";
    }

    function mouseLeave() {
      el.style.backgroundColor = "#fff";
    }

    el.addEventListener("mouseenter", mouseEnter);
    el.addEventListener("mouseleave", mouseLeave);
  }
  beforeUnmount() {}
}

export default new hover();
