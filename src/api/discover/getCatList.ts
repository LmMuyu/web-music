import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

export function getCatList(config: AxiosRequestConfig) {
  return request(config);
}
