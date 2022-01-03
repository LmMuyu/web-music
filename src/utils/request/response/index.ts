import { AxiosResponse } from "axios";
import { reqCode, setCookie } from "./result";

export default function useResponse(httpRes: AxiosResponse<any>) {
  [reqCode, setCookie].map((fn) => {
    Promise.resolve(httpRes).then((res) => fn(res));
  });
}
