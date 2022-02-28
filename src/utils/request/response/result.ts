import { logout } from "../../../api/app/login";
import store from "../../../store";

import jsCookie from "js-cookie";
import { useLocalStorage } from "../../useLocalStorage";
import { promptbox } from "../../../components/promptBox";
import { findInfo } from "../methods";

import type { CookieAttributes } from "js-cookie";
import type { AxiosResponse } from "axios";

interface cookieOptions {
  name: string;
  value: string;
  options?: CookieAttributes;
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
    const setcookieObj: cookieOptions = {
      name: "",
      value: "",
      options: {
        expires: 0,
        path: "/",
        sameSite: "None",
        secure: true,
      },
    };

    const cookikeSplitItem = cookieItem.split(";").reduce((pre, next, index) => {
      const reg = /(.+?)=(.+?);/g;
      let execReg: RegExpExecArray = null;

      while ((execReg = reg.exec(next)) !== null) {
        const [key, value] = [execReg[1], execReg[2]];

        if (index === 0) {
          pre.name = key;
          pre.value = value;
        } else {
          const low = key.toLocaleLowerCase();
          if (low !== "path") {
            pre.options[low] = value;
          }
        }
      }

      return pre;
    }, setcookieObj);

    console.log(cookikeSplitItem);

    jsCookie.set(cookikeSplitItem.name, cookikeSplitItem.value, cookikeSplitItem.options);
  });
}
