interface OPTIONS {
  asyncBackcall?: (value: any) => any;
  quickrequest?: boolean;
  totRiggerQuickrequest?: boolean;
}

function promiseData(thendata: Promise<any>, asyncBackcall: OPTIONS["asyncBackcall"]) {
  try {
    if ("then" in thendata) {
      thendata.then(asyncBackcall);
    }
  } catch (error) {}
}

export function debounce<T extends Function>(fn: T, delay: number = 150, options?: OPTIONS) {
  let times: NodeJS.Timeout | null = null;

  function _debounce(...arg: any) {
    if (times) {
      clearTimeout(times);
      times = null;
    }

    if (options?.quickrequest) {
      const retData = fn.apply(null, arg);
      promiseData(retData, options?.asyncBackcall ?? (() => {}));
      options.quickrequest = false;
    } else {
      times = setTimeout(() => {
        const retData = fn.apply(null, arg);
        promiseData(retData, options?.asyncBackcall ?? (() => {}));
        clearTimes();
        options?.totRiggerQuickrequest && (options.quickrequest = true);
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
