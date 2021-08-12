import axios from "axios";

import { promptbox } from "../../components/promptBox";
import { loginStateus, setCookie } from "./methods";
import store from "../../store";

import type { AxiosRequestConfig, Canceler, CancelTokenStatic } from "axios";

export default function request(config: AxiosRequestConfig) {
  let requestHttpToken: CancelTokenStatic | undefined;
  let token: Canceler;
  const method = config.method ? config.method : "get";

  const isGet = method === "get";
  isGet && (requestHttpToken = axios.CancelToken);

  const instance = axios.create({
    baseURL: "https://netease-cloud-music-api-chi-ashy.vercel.app",
    method: "GET",
    timeout: 5000,
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
    (config) => {
      if (config.response) {
        const response = config.response;

        if (response.status) {
          switch (response.status) {
            case 404:
              Promise.reject().catch(
                () =>
                  promptbox({
                    title: response.data.message,
                  }) && response
              );

              return response;
            default:
              return Promise.reject(config);
          }
        }
      }
    }
  );

  return instance(Object.assign({}, config));
}
