import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

export function getQrKey(config: AxiosRequestConfig) {
  return request(config);
}

export function getQrCreate(config: AxiosRequestConfig) {
  return request(config);
}

export function checkStatus(config: AxiosRequestConfig) {
  return request(config);
}
