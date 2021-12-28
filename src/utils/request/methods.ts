import jsCookie from "js-cookie";
import store from "../../store";

import { useLocalStorage } from "../useLocalStorage";
import { logout } from "../../api/app/login";

import type { CookieAttributes } from "js-cookie";
import { AxiosResponse } from "axios";

interface cookieOptions {
  name: string;
  value: string;
  options?: CookieAttributes;
}

interface CONFIG_DEFAULT {
  retry?: number;
  retrydelay?: number;
  _retryCount?: number;
}

export function setCookie(cookie: string) {
  cookie.split(";;").map((cookieItem) => {
    const cookieSplice = cookieItem.split(";");

    const setcookieObj: cookieOptions = {
      name: "",
      value: "",
      options: {
        expires: 0,
        path: "",
      },
    };

    for (let i = 0; i < cookieSplice.length; i++) {
      const spliceIndex = cookieSplice[i].indexOf("=");

      const [key, value] = [
        cookieSplice[i].slice(0, spliceIndex),
        cookieSplice[i].slice(spliceIndex + 1),
      ];

      if (i === 0) {
        setcookieObj.name = key;
        setcookieObj.value = value;
      } else if (key === "Max-Age") {
        setcookieObj.options.expires = parseInt(value);
      } else {
        const low = key.toLocaleLowerCase();
        const is = Object.prototype.toString.call(setcookieObj.options, low);

        if (is) {
          if (low === "expires" && setcookieObj.options.expires === 0) {
            setcookieObj.options.expires = value as unknown as Date;
          } else {
            continue;
          }

          setcookieObj.options[key] = value;
        }
      }
    }

    console.log(setcookieObj);

    jsCookie.set(setcookieObj.name, setcookieObj.value, setcookieObj.options);
  });
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
  const url = httpRes.config.url;

  if (url === "/login/status") {
    //是否已经登录
    const islogin = httpRes.data.account !== null && httpRes.data.profile !== null;
    const token = window.localStorage.getItem("token");
    await isLoginWatchObj(islogin);

    if (islogin && token) {
      store.commit("login/switchStatus", true);
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
