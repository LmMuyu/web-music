import { AxiosRequestConfig } from "axios";
import * as allErrorMethods from "./result";

function forRunFn(config: AxiosRequestConfig, methods: Record<string, Function>) {
  for (const key in methods) {
    if (typeof methods[key] === "function" && Object.prototype.hasOwnProperty.call(methods, key)) {
      (methods[key] as Function)(config);
    }
  }
}

export default function useRequest(
  config: AxiosRequestConfig,
  type: "error" | "result" = "result"
) {
  if (type === "result") {
    forRunFn(config, allErrorMethods);
  } else {
    forRunFn(config, allErrorMethods);
  }
}
