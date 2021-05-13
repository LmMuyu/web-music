export function throttle(fn: Function, delay: number) {
  let oldTime = +new Date();

  function _throllte(...args: any[]) {
    const nowTime = +new Date();

    if (nowTime - oldTime >= delay) {
      fn.apply(null, args);
      oldTime = nowTime;
    }
  }

  return _throllte;
}
