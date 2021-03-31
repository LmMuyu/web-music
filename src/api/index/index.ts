import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";
 
export function getBanner(config: AxiosRequestConfig) {
  return request(config);
}
