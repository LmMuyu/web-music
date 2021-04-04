import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

export function getSearch(config: AxiosRequestConfig) {
  return request(config);
}
