import axios, { AxiosInstance, CancelTokenSource } from "axios";

import { tryAgainRequest, cancelHttpRequest, deleteHttpToken } from "./methods";
import useResponse from "./response";
import useRequest from "./request";

import type { AxiosRequestConfig } from "axios";
import jsCookie from "js-cookie";
import { sliceurl } from "./response/result";

interface CONFIG_DEFAULT {
  defaults?: {
    retry?: number;
    retrydelay?: number;
  };
}

const csrf_token = jsCookie.get("__csrf");

function setRetryCount(
  instance: AxiosInstance & CONFIG_DEFAULT,
  { retry, delay }: { retry?: number; delay?: number }
) {
  instance.defaults.retry = retry ?? 3;
  instance.defaults.retrydelay = delay ?? 500;
}

export default function request(config: AxiosRequestConfig) {
  // const cancelToken = httpCancelToken({
  //   url: config.url,
  //   query: config.params,
  //   params: config.data,
  // });
  const isget = (config.method ?? "GET").toLocaleUpperCase() === "GET";

  const instance = axios.create({
    // baseURL: "http://120.27.135.200:3000/",
    baseURL: "https://netease-cloud-music-api-chi-ashy.vercel.app/",
    // baseURL: "http://localhost:3000",
    method: "GET",
    timeout: 10000,
    withCredentials: true,
  });

  if (isget) {
    setRetryCount(instance, {});
  }

  //@ts-ignore
  instance.defaults._requrl = config.url;

  instance.interceptors.request.use(
    (config) => {
      useRequest(config);
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  instance.interceptors.response.use(
    (httpRes) => {
      Promise.resolve().then(() => useResponse(httpRes, "result"));
      httpRes.config.url = sliceurl(httpRes.config.url);

      return httpRes;
    },
    async (config) => {
      const ret: { config?: any; isretry?: boolean } = await tryAgainRequest(config);
      if (ret.isretry) return await instance(ret.config);

      return Promise.reject(config);
    }
  );

  return instance(
    Object.assign({}, config, {
      url: config.url + `${!!csrf_token ? "?csrf_token=" + csrf_token : ""}`,
    } as AxiosRequestConfig)
  );
}
