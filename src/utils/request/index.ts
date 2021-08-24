import axios, { AxiosInstance } from "axios";

import { promptbox } from "../../components/promptBox";
import { loginStateus, setCookie, tryAgainRequest } from "./methods";

import type { AxiosRequestConfig, Canceler, CancelTokenStatic } from "axios";

interface CONFIG_DEFAULT {
  defaults?: {
    retry?: number;
    retrydelay?: number;
  };
}

function setConfig(instance: AxiosInstance & CONFIG_DEFAULT) {
  instance.defaults.retry = 3;
  instance.defaults.retrydelay = 500;
}

export default function request(config: AxiosRequestConfig) {
  let requestHttpToken: CancelTokenStatic | undefined;
  let token: Canceler;
  const method = config.method ? config.method : "get";

  const isGet = method === "get";
  isGet && (requestHttpToken = axios.CancelToken);

  const instance = axios.create({
    baseURL: "https://netease-cloud-music-api-chi-ashy.vercel.app",
    method: "GET",
    timeout: 10000,
    headers: {},
    withCredentials: true,
    ...(isGet
      ? {
          cancelToken:
            requestHttpToken &&
            new requestHttpToken((http) => {
              token = http;
            }),
        }
      : {}),
  });

  isGet && setConfig(instance);

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
      const url = httpRes.config.url;

      (httpRes?.data?.cookie as string)?.length > 0 &&
        Promise.resolve().then(() => setCookie(httpRes.data.cookie));

      loginStateus(url, httpRes);

      return httpRes;
    },
    async (config) => {
      const ret: { config?: any; isretry?: boolean } = await tryAgainRequest(
        config
      );

      if (ret.isretry) return instance(ret.config);

      return Promise.reject(config);
    }
  );

  return instance(Object.assign({}, config));
}
