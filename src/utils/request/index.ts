import axios from "axios";

import setCatch from "../../utils/catch/setCatch";
import { promptbox } from "../../components/promptBox";

import type { AxiosRequestConfig, Canceler, CancelTokenStatic } from "axios";

const catchMethods = setCatch();

export default function request(config: AxiosRequestConfig) {
  let requestHttpToken: CancelTokenStatic | undefined;
  let token: Canceler;
  const method = config.method ? config.method : "get";

  const isGet = method === "get";
  isGet && (requestHttpToken = axios.CancelToken);

  const instance = axios.create({
    baseURL: "http://127.0.0.1:3000",
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
