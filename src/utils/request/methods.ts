import Cookie from "js-cookie";

import { useLocalStorage } from "../useLocalStorage";
import store from "../../store";

import type { CookieAttributes } from "js-cookie";
import { AxiosInstance, AxiosRequestConfig } from "axios";

interface cookieOptions {
  name: string;
  value: string;
  options: CookieAttributes;
}

interface CONFIG_DEFAULT {
  retry?: number;
  retrydelay?: number;
  _retryCount?: number;
}

export function setCookie(cookie: string) {
  const matchList = cookie.match(/.+?(?=;;)/gi);

  if (matchList) {
    for (const v of matchList) {
      const cookieObj: cookieOptions = {
        name: "",
        value: "",
        options: {
          path: "",
          expires: 0,
        },
      };

      if (v[0] === ";") {
        const cookieStr = v.substring(2);
        splitCookie(cookieStr, cookieObj);
      } else {
        const cookieStr = v;
        splitCookie(cookieStr, cookieObj);
      }
    }
  }
}

function splitCookie(cookie: string, cookieObj: cookieOptions) {
  const splitList = cookie.split(";");

  splitList.forEach((v, i) => {
    const sliceIndex = v.indexOf("=");
    let [key, value] = [v.slice(0, sliceIndex), v.slice(sliceIndex + 1)];

    if (i === 0) {
      cookieObj.name = key;
      cookieObj.value = value;
    } else {
      const options = cookieObj.options;
      type keys = keyof typeof options;

      const name = key.toLocaleLowerCase().trim();
      if (Object.prototype.hasOwnProperty.call(options, name)) {
        let optionValue: string | Date = value;
        if (name === "expires") optionValue = new Date(value);
        options[name as keys] = optionValue;
      }
    }
  });

  const {
    name,
    value,
    options: { expires, path },
  } = cookieObj;

  Cookie.set(name, value, {
    path,
    expires,
    domain: window.location.host,
  });
}

const removeLocalStoreageKey = () => {
  const info = useLocalStorage("userInfo");
  const token = useLocalStorage("token");

  if (info) {
    localStorage.removeItem("userInfo");
  }

  if (token) {
    localStorage.removeItem("token");
  }
};

export function loginStateus(url: string, httpRes: Record<string, any>) {
  if (url === "/login/status") {
    Promise.resolve(httpRes.data).then(({ data }) => {
      const local = useLocalStorage("userInfo");

      if (data.account !== null && data.profile !== null && !local.value) {
        store.commit("login/switchStatus", true);
        store.commit("login/findInfo");
        console.log(true);
      } else {
        store.commit("login/switchStatus", false);
        console.log(false);
      }
    });
  }
}

export function tryAgainRequest(err: any) {
  const config: CONFIG_DEFAULT = err.config;
  console.log(config);

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
