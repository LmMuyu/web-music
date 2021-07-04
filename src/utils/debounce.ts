export function debounce(fn: Function, delay: number = 150) {
  let times: NodeJS.Timeout | null = null;

  function _debounce(arg: any) {
    if (times) {
      clearTimeout(times);
    }

    times = setTimeout(() => {
      fn.apply(null, arg);
      _debounce.clearTimes();
    }, delay);
  }

  _debounce.clearTimes = function () {
    clearTimeout(times!);
    times = null;
  };

  return _debounce;
}
