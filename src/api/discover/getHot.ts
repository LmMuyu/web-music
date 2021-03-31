import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

export function getHot(config: AxiosRequestConfig) {
  return request(config);
}
