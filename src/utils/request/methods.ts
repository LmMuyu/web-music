import { CancelToken, CancelTokenSource } from "axios";

interface CONFIG_DEFAULT {
  retry?: number;
  retrydelay?: number;
  _retryCount?: number;
}

type CANCEL_MAP = Map<string, CancelTokenSource[]>;

//重新请求
export function tryAgainRequest(err: any) {
  console.log(err);

  const config: CONFIG_DEFAULT = err.config;

  if (!config.retry || !config)
    return {
      config,
      isretry: false,
    };

  config._retryCount = config._retryCount || 0;

  if (config._retryCount >= config.retry) {
    return {
      config,
      isretry: false,
    };
  }

  config._retryCount += 1;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        config,
        isretry: true,
      });
    }, config.retrydelay || 1);
  });
}

export function deleteHttpToken(url: string, map: CANCEL_MAP, token: CancelToken) {
  const cancelSourceLists = map.get(url);
  const index = cancelSourceLists.findIndex((source) => source.token === token);


  console.log(index);
  

  if (index >= 0) {
    cancelSourceLists.length === 0
      ? map.delete(url)
      : map.set(url, cancelSourceLists.splice(index, 1));
  }
}

export function cancelHttpRequest(url: string, map: CANCEL_MAP, meg?: string) {
  if (map.has(url)) {
    const cancelSourceLists = map.get(url);
    const index = cancelSourceLists.length - 1;

    if (index >= 0) {
      const source = cancelSourceLists.splice(index, 1)[0];
      source.cancel(meg ? meg : "");
      cancelSourceLists.length === 0 ? map.delete(url) : map.set(url, cancelSourceLists);
    }
  }
}
