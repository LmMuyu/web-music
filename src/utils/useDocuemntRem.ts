export function windowRem() {
  const resize = new ResizeObserver((entries) => {
    entries.forEach((node) => {
      document.documentElement.style.fontSize =
        node.contentRect.width / 100 + "px";
    });
  });

  resize.observe(document.documentElement);
}
