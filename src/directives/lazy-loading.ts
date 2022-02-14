import { Directive } from "@vue/runtime-core";

let lazysrc = "";
let lazyObserve: IntersectionObserver | null = null;

function loadimg(target: HTMLImageElement) {
  return new Promise((resolve, reject) => {
    const src = target["lazy-src"];
    const img = document.createElement("img");
    img.src = src;

    img.onload = function () {
      target.src = img.src;
      resolve(true);
    };

    img.onerror = function () {
      reject(false);
    };
  });
}

function lazyLoading() {
  const interObserver = new IntersectionObserver((entrys) => {
    entrys.forEach(async (entry: IntersectionObserverEntry) => {
      const target = entry.target as HTMLImageElement;
      target.src = lazysrc;

      if (entry.isIntersecting) {
        try {
          await loadimg(target);
          interObserver.unobserve(target);
        } catch (error) {
          console.error(error);
        }
      }
    });
  });

  return interObserver;
}

function dfs(el: HTMLElement, startindex: number) {
  let index = startindex;
  const node = el.children[index] as HTMLElement;
  if (node === undefined || node === null) return;

  if (node.nodeName === "IMG") {
    return node;
  } else {
    const isnode = dfs(node, 0);

    if (isnode !== undefined) {
      return isnode;
    }

    index++;
  }

  return undefined;
}

function boundValue(value: any): string {
  if (typeof value === "string") {
    return value;
  } else if (Object.prototype.toString.call(value) === "[Object object]") {
    return value.src ? value.src : lazysrc;
  } else {
    return lazysrc;
  }
}

const DirectiveOptions: Directive = {
  mounted(el: HTMLElement, bound) {
    lazysrc = boundValue(bound.value);

    if (el.getAttribute("lazy-src")) {
      lazyObserve.observe(el);
    } else {
      const node = dfs(el, 0);
      if (node !== undefined) {
        lazyObserve.observe(node);
      }
    }
  },
};

export default function lazy(src: string) {
  lazysrc = src;
  lazyObserve = lazyLoading();
  return DirectiveOptions;
}
