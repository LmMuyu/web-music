import axios, { AxiosInstance } from "axios";

import { tryAgainRequest } from "./methods";
import useResponse from "./response";
import useRequest from "./request";

import jsCookie from "js-cookie";
import { sliceurl } from "./response/result";
import { isType } from "../methods";

import type { AxiosRequestConfig } from "axios";

interface CONFIG_DEFAULT {
  defaults?: {
    retry?: number;
    retrydelay?: number;
  };
}

function setRetryCount(
  instance: AxiosInstance & CONFIG_DEFAULT,
  { retry, delay }: { retry?: number; delay?: number }
) {
  instance.defaults.retry = retry ?? 3;
  instance.defaults.retrydelay = delay ?? 500;
}

function filterParams(params: Object) {
  if (isType(params) !== "Object") {
    throw new Error("请求参数params不是object");
  }

  let filterParam = {};

  for (const key in params) {
    if (params[key] !== null) {
      filterParam[key] = params[key];
    }
  }

  return filterParam;
}

export const BASEURL = "https://netease-cloud-music-api-chi-ashy.vercel.app/";

export default function request(config: AxiosRequestConfig) {
  // const cancelToken = httpCancelToken({
  //   url: config.url,
  //   query: config.params,
  //   params: config.data,
  // });
  config.params = config.params && filterParams(config.params);
  const isget = (config.method ?? "GET").toLocaleUpperCase() === "GET";

  const instance = axios.create({
    // baseURL: "http://120.27.135.200:3000",
    // baseURL: BASEURL,
    baseURL: "/cloud",
    method: "GET",
    timeout: 30000,
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

  const csrf_token = jsCookie.get("__csrf");

  const ass = Object.assign({}, config, {
    url: config.url + `${!!csrf_token ? "?csrf_token=" + csrf_token : ""}`,
  } as AxiosRequestConfig);

  return instance(ass);
}
