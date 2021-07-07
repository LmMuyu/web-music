export function windowRem() {
  let minpx: number;

  const resize = new ResizeObserver((entries) => {
    entries.forEach((node) => {
      const winWidth = node.contentRect.width;
      minpx = minpx || (winWidth * 0.618) >>> 0;

      if (winWidth >= minpx) {
        document.documentElement.style.fontSize = winWidth / 100 + "px";
      }
    });
  });

  resize.observe(document.documentElement);
}
