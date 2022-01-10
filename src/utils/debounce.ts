interface OPTIONS {
  asyncBackcall?: (value: any) => any;
}

export function debounce<T extends Function>(fn: T, delay: number = 150, options?: OPTIONS) {
  let times: NodeJS.Timeout | null = null;

  function _debounce(...arg: any) {
    if (times) {
      clearTimeout(times);
    }

    times = setTimeout(() => {
      const retData = fn.apply(null, arg);

      if ("then" in retData) {
        (retData as Promise<any>).then(options?.asyncBackcall || (() => {}));
      }

      _debounce.clearTimes();
    }, delay);
  }

  _debounce.clearTimes = function () {
    clearTimeout(times!);
    times = null;
  };

  return _debounce;
}
