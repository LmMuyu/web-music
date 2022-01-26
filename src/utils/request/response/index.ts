import { AxiosResponse } from "axios";
import * as allResultMethods from "./result";
import * as allErrorMethods from "./error";

function forRunFn(httpRes: AxiosResponse<any>) {
  for (const key in allResultMethods) {
    if (
      typeof allResultMethods[key] === "function" &&
      Object.prototype.hasOwnProperty.call(allResultMethods, key)
    ) {
      (allResultMethods[key] as Function)(httpRes);
    }
  }
}

export default function useResponse(
  httpRes: AxiosResponse<any>,
  type: "error" | "result" = "result"
) {
  if (type === "result") {
    forRunFn(httpRes);
  } else {
    forRunFn(httpRes);
  }
}
