import { logout } from "../../../api/app/login";
import store from "../../../store";

import type { CookieAttributes } from "js-cookie";
import type { AxiosResponse } from "axios";

import jsCookie from "js-cookie";
import { useLocalStorage } from "../../useLocalStorage";
import { promptbox } from "../../../components/promptBox";

interface cookieOptions {
  name: string;
  value: string;
  options?: CookieAttributes;
}

export async function reqCode(httpRes: AxiosResponse<any>) {
  try {
    const data = httpRes.data;

    switch (httpRes.status) {
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

function isLoginWatchObj(isstatus: boolean) {
  return new Promise((resolve) => {
    store.dispatch("login/runWatchFn", [resolve, isstatus]);
  });
}

async function status(httpRes: AxiosResponse<any>) {
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
}

export async function loginStateus(httpRes: AxiosResponse<any>) {
  try {
    Promise.resolve(() => status(httpRes));
  } catch (err) {
    console.log(err);
  }
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

function findInfo() {
  const data = useLocalStorage("userinfo");
  if (!data.value) {
    throw new Error("local_undefined_userinfo");
  }

  return JSON.parse(data.value);
}

export function setCookie(httpRes: AxiosResponse<any>) {
  // console.log(httpRes);
  const cookie: string = httpRes.data.cookie;
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
    jsCookie.set(setcookieObj.name, setcookieObj.value, setcookieObj.options);
  });
}
