import store from "../../store";
import { transformUserData } from "./useBroadcastChannel";

export function loginStoreSetInfo(data: any, status: boolean) {
  store.commit("login/switchStatus", status);
  store.commit("login/setUserInfo", [data, "login"]);
}

export async function loginStatus(serveIslogin: boolean, account: any, profile: any) {
  await dispatchWatchObserver(serveIslogin);
  if (serveIslogin) {
    const data = transformUserData(profile);
    loginStoreSetInfo(data, true);
  } else {
    store.commit("login/switchStatus", false);
    removeLocalStoreageKey();
  }
}

export function dispatchWatchObserver(status: boolean) {
  return new Promise((resolve) => {
    store.dispatch("login/dispatchWatchFn", [resolve, status]);
  });
}

export const removeLocalStoreageKey = () => {
  const storeages = ["tokenJsonStr", "userinfo", "token", "tokenStrObj"];
  storeages.map((key) => {
    localStorage.removeItem(key);
  });
};
