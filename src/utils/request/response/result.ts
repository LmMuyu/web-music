import { logout } from "../../../api/app/login";
import store from "../../../store";

import jsCookie from "js-cookie";
import { useLocalStorage } from "../../useLocalStorage";
import { promptbox } from "../../../components/promptBox";
import { findInfo } from "../methods";

import type { AxiosResponse } from "axios";

interface cookieOptions {
  name: string;
  value: string;
  options?: jsCookie.CookieAttributes;
}

export async function reqCode(httpRes: AxiosResponse<any>) {
  try {
    const data = httpRes.data;

    switch (data.code) {
      case 404:
        promptbox({ title: data.message });
        break;
      case 406:
        promptbox({ title: data.message });
        break;
      case 502:
        promptbox({ title: data.message });
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

function dispatchWatchObserver(status: boolean) {
  return new Promise((resolve) => {
    store.dispatch("login/dispatchWatchFn", [resolve, status]);
  });
}

async function loginStatus(serveIslogin: boolean) {
  const token = useLocalStorage("token");
  await dispatchWatchObserver(serveIslogin);

  if (serveIslogin && token.value) {
    const data = findInfo();
    store.commit("login/switchStatus", true);
    store.commit("login/setUserInfo", data);
  } else {
    store.commit("login/switchStatus", false);
    removeLocalStoreageKey();
  }
}

async function status(httpRes: AxiosResponse<any>) {
  const url = httpRes.config.url;
  if (url === "/login/status") {
    //是否已经登录
    const islogin = httpRes.data.data.account !== null && httpRes.data.data.profile !== null;
    loginStatus(islogin);
  } else if (url === "/logout") {
    store.commit("login/emitTypeWatchFn", "stopwatch");
    store.commit("login/switchStatus", false);
    dispatchWatchObserver(false);
    removeLocalStoreageKey();
  }
}

export async function loginStateus(httpRes: AxiosResponse<any>) {
  try {
    Promise.resolve().then(() => status(httpRes));
  } catch (err) {
    console.log(err);
  }
}

const removeLocalStoreageKey = () => {
  const storeages = ["tokenJsonStr", "userinfo", "token", "tokenStrObj"];
  storeages.map((key) => {
    localStorage.removeItem(key);
  });
};

export function setCookie(httpRes: AxiosResponse<any>) {
  const cookie: string = httpRes.data.cookie;
  if (!cookie) return;

  cookie.split(";;").map((cookieItem) => {
    const setCookieInstance: cookieOptions = {
      name: "",
      value: "",
      options: {
        expires: new Date(),
        path: "/",
        sameSite: "None",
        secure: true,
      },
    };

    const reg = /(.+?)=(.*?)(;|(?<=(Path=)).+)/g;
    let execReg: RegExpExecArray = null;
    let index = 0;

    while ((execReg = reg.exec(cookieItem)) !== null) {
      const [key, value] = [execReg[1], execReg[2]];

      if (index === 0) {
        setCookieInstance.name = key;
        setCookieInstance.value = value;
      } else {
        const has = Object.prototype.hasOwnProperty;
        const instanceOptions = setCookieInstance.options;
        const low = key.toLocaleLowerCase().trim();

        if (low !== "path") {
          if (has.call(setCookieInstance.options, low))
            instanceOptions[low] = low === "expires" ? new Date(low) : value;
        } else {
          instanceOptions[low] = value;
        }
      }

      index++;
    }

    console.log(setCookieInstance);

    jsCookie.set(setCookieInstance.name, setCookieInstance.value, setCookieInstance.options);
  });
}
