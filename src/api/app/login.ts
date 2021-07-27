import request from "../../utils/request";

import store from "../../store";

import type { State } from "../../store/type";

export function loginStateus() {
  const loginState = (store.state as State).loginState;

  const resState =
    loginState === 301 ? loginState : request({ url: "/login/status" });

  return resState;
}
