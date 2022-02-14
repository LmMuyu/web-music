export function throttle(
  fn: Function,
  delay: number = 150,
  options?: {
    initThrollte?: boolean;
  }
) {
  let oldTime = +new Date();

  function _throllte(...args: any[]) {
    const nowTime = +new Date();
    if (options?.initThrollte) {
      fn.apply(null, args);
      options.initThrollte = false;
    } else if (nowTime - oldTime >= delay) {
      fn.apply(null, args);
      oldTime = nowTime;
    }
  }

  return _throllte;
}
