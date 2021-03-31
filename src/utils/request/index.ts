import axios from "axios";

import type { AxiosRequestConfig } from "axios";

export default function request(config: AxiosRequestConfig) {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:3000",
    method: "GET",
    timeout: 5000,
    headers: {},
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
    (config) => {
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return instance(Object.assign({}, config));
}
