import store from "../../store";

import { useLocalStorage } from "../useLocalStorage";
import { logout } from "../../api/app/login";

import { AxiosResponse } from "axios";

interface CONFIG_DEFAULT {
  retry?: number;
  retrydelay?: number;
  _retryCount?: number;
}

const removeLocalStoreageKey = () => {
  const info = useLocalStorage("userinfo");
  const token = useLocalStorage("token");

  if (info) {
    localStorage.removeItem("userinfo");
  }

  if (token) {
    localStorage.removeItem("token");
  }
};

function isLoginWatchObj(isstatus: boolean) {
  return new Promise((resolve) => {
    store.dispatch("login/runWatchFn", [resolve, isstatus]);
  });
}

export async function loginStateus(httpRes: AxiosResponse<any>) {
  try {
    const url = httpRes.config.url;

    if (url === "/login/status") {
      //是否已经登录
      const islogin = httpRes.data.account !== null && httpRes.data.profile !== null;
      const token = localStorage.getItem("token");
      await isLoginWatchObj(islogin);

      if (islogin && token) {
        const data = findInfo();

        store.commit("login/switchStatus", true);
        store.commit("login/setUserInfo", data);
      } else {
        store.commit("login/switchStatus", false);
        removeLocalStoreageKey();
        logout();
      }
    } else if (url === "/logout") {
      store.commit("login/emitTypeWatchFn", "stopwatch");
      store.commit("login/switchStatus", false);
      isLoginWatchObj(false);
      removeLocalStoreageKey();
    }
  } catch (err) {
    console.log(err);
  }
}

export function tryAgainRequest(err: any) {
  const config: CONFIG_DEFAULT = err.config;

  if (!config.retry || !config)
    return {
      config,
      isretry: false,
    };

  config._retryCount = config._retryCount || 0;

  if (config._retryCount >= config.retry) {
    return {
      config,
      isretry: false,
    };
  }

  config._retryCount += 1;

  const before = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        config,
        isretry: true,
      });
    }, config.retrydelay || 1);
  });

  return before;
}

function findInfo() {
  const data = useLocalStorage("userinfo");
  if (!data.value) {
    throw new Error("local_undefined_userinfo");
  }

  return JSON.parse(data.value);
}
