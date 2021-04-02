import type { AxiosRequestConfig, Canceler, CancelTokenStatic } from "axios";
import axios from "axios";
import setCatch from "../../utils/catch/setCatch";

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
    (err) => {
      return Promise.reject(err);
    }
  );

  return instance(Object.assign({}, config));
}
