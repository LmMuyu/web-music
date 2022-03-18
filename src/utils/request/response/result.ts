import store from "../../../store";
import router from "../../../routes";

import jsCookie from "js-cookie";
import { promptbox } from "../../../components/promptBox";

import type { AxiosResponse } from "axios";
import {
  dispatchWatchObserver,
  loginStatus,
  removeLocalStoreageKey,
} from "../../../layout/login/login";

interface cookieOptions {
  name: string;
  value: string;
  options?: jsCookie.CookieAttributes;
}

let loginguo = false;

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

async function status(httpRes: AxiosResponse<any>) {
  const url = httpRes.config.url;

  await router.isReady();
  const route = router.currentRoute;

  if (url === "/login/status" && !(route.value.path.indexOf("/login") > -1) && !loginguo) {
    loginguo = true;
    console.log(true);
    const account = httpRes.data.data.account;
    const profile = httpRes.data.data.profile;

    //是否已经登录
    const islogin = account !== null && profile !== null;
    loginStatus(islogin, account, profile);
  } else if (url === "/logout") {
    loginguo = false;
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

export function setCookie(data) {
  const cookie: string = data.cookie;
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

    jsCookie.set(setCookieInstance.name, setCookieInstance.value, setCookieInstance.options);
  });
}

export function sliceurl(url: string) {
  //@ts-ignore
  if (typeof url != "string") return url.config.url;
  const index = url.indexOf("?");

  if (index > -1) {
    return url.slice(0, index);
  }
}
