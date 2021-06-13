import { Directive } from "@vue/runtime-core";

interface Options {
  src?: string;
  root: Element;
}

function observer(el: HTMLElement, src: string) {
  const interObserver = new IntersectionObserver((entrys) => {
    entrys.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        interObserver.unobserve(target);
        if (target.tagName.toLocaleLowerCase() === "img") {
          target.src = src;
        }
      }
    });
  });

  interObserver.observe(el);
}

let timer: NodeJS.Timeout | null = null;
const lazyNodeList: { node: any; src: string }[] = [];

const DirectiveOptions: Directive = {
  mounted(el, bound) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lazyNodeList.push({ node: el, src: bound.value });

    timer = setTimeout(() => {
      lazyNodeList.forEach((value) => {
        observer(value.node, value.src);
      });
      timer = null;
    });
  },
};

export default DirectiveOptions;
