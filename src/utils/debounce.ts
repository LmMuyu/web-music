interface OPTIONS {
  asyncBackcall?: (value: any) => any;
  quickrequest?: boolean;
}

function promiseData(thendata: Promise<any>, asyncBackcall: OPTIONS["asyncBackcall"] = () => {}) {
  if ("then" in thendata) {
    thendata.then(asyncBackcall);
  }
}

export function debounce<T extends Function>(fn: T, delay: number = 150, options?: OPTIONS) {
  let times: NodeJS.Timeout | null = null;

  function _debounce(...arg: any) {
    if (times) {
      clearTimeout(times);
      times = null;
    }

    if (options.quickrequest) {
      const retData = fn.apply(null, arg);
      promiseData(retData);
      options.quickrequest = false;
    } else {
      times = setTimeout(() => {
        const retData = fn.apply(null, arg);
        promiseData(retData);
        clearTimes();
      }, delay);
    }
  }

  function clearTimes() {
    clearTimeout(times!);
    times = null;
  }

  _debounce.clearTimes = clearTimes;
  return _debounce;
}
