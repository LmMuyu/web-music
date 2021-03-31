import type { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

export function searchDefault(config: AxiosRequestConfig) {
  return request(config);
}
