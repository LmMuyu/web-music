import axios, { AxiosInstance, CancelTokenSource } from "axios";

import { tryAgainRequest, cancelHttpRequest, deleteHttpToken } from "./methods";

import type { AxiosRequestConfig } from "axios";
import useResponse from "./response";

const cancelMap = new Map<string, CancelTokenSource[]>();

interface CONFIG_DEFAULT {
  defaults?: {
    retry?: number;
    retrydelay?: number;
  };
}

function httpCancelToken(url: string) {
  const token = axios.CancelToken;
  const source = token.source();

  if (cancelMap.has(url)) {
    const cancelArr = cancelMap.get(url);
    cancelArr.push(source);
    cancelMap.set(url, cancelArr);
  } else {
    cancelMap.set(url, [source]);
  }

  return source.token;
}

function setRetryCount(
  instance: AxiosInstance & CONFIG_DEFAULT,
  { retry, delay }: { retry?: number; delay?: number }
) {
  instance.defaults.retry = retry ?? 3;
  instance.defaults.retrydelay = delay ?? 500;
}

export default function request(config: AxiosRequestConfig) {
  const cancelToken = httpCancelToken(config.url);
  const isget = (config.method ?? "GET").toLocaleUpperCase() === "GET";

  const instance = axios.create({
    baseURL: "http://120.27.135.200:3000/",
    method: "GET",
    timeout: 10000,
    headers: {},
    withCredentials: true,
    cancelToken,
  });

  if (isget) {
    setRetryCount(instance, {});
  }

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  instance.interceptors.response.use(
    (httpRes) => {
      Promise.resolve().then(() => useResponse(httpRes, "result"));
      Promise.resolve().then(() => deleteHttpToken(config.url, cancelMap, cancelToken));
      return httpRes;
    },
    async (config) => {
      Promise.resolve().then(() => deleteHttpToken(config.url, cancelMap, cancelToken));

      const ret: { config?: any; isretry?: boolean } = await tryAgainRequest(config);
      if (ret.isretry) return await instance(ret.config);

      return Promise.reject(config);
    }
  );

  return instance(Object.assign({}, config));
}
