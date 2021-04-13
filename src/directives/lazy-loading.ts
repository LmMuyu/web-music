import { Directive } from "@vue/runtime-core";

function lazy() {
  const interOb = new IntersectionObserver((entries) => {
    const entriesItem = entries[0];
    const target = entriesItem.target;

    if (entriesItem.isIntersecting) {
      console.log(entriesItem);

      const imgsrc = target.getAttribute("lazy-src")!;

      target.setAttribute("src", imgsrc);
      target.removeAttribute("lazy-src");

      interOb.unobserve(target);
    }
  });

  return () => interOb;
}

const imgLazy = lazy();

const DirectiveOptions: Directive = {
  mounted(el: HTMLElement) {
    imgLazy().observe(el);
  },
  unmounted() {},
};

export default DirectiveOptions;
