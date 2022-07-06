import { nextTick } from "vue";

import { setCookie } from "../../utils/request/response/result";
import { useLocalStorage } from "../../utils/useLocalStorage";
import openNotification from "../../utils/element/notification";
import { loginStoreSetInfo } from "./login";

import type { USERDATA } from "../../store/type";

type ExtractPickForValue<T, K extends keyof T> = T[K];

export type USERINFO = USERDATA;

export type PromiseExtractPickValue = ExtractPickForValue<BroadcastChannel, "postMessage">;

export interface DispatchBcRet {
  postMessage: PromiseExtractPickValue;
  userdata?: any;
}

interface ACCESS_OR_REFRESH_TOKEN {
  token: string;
  access_token: string;
  refresh_token: string;
  tokenJsonStr: string;
  tokenStrObj: string;
}

interface GoBeforePage {
  gopage: boolean;
  sourcess: Function;
}

export function mainBCBus(): Promise<USERDATA> {
  let BC = new BroadcastChannel("login");

  return new Promise((resolve) => {
    BC.onmessage = function (ev) {
      const userInfo = ev.data as USERDATA;
      BC.postMessage("close_curr_page");
      BC.close();
      BC = null;
      nextTick(() => openNotification("欢迎回来" + userInfo.nickname, null, "success"));
      resolve(userInfo);
    };

    BC.onmessageerror = function () {
      console.error("BroadcastChannel接收到一条无法反序列化的消息!");
    };
  });
}

//登录后跨页面通信
export function loginBCBus(userdata: any, gobeforepage: GoBeforePage): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let BC = new BroadcastChannel("login");

    BC.onmessage = function (ev) {
      const msg = ev.data;
      if (msg == "close_curr_page") {
        if (gobeforepage.gopage) {
          gobeforepage.sourcess();
        } else {
          window.close();
        }
        BC.close();
        BC = null;
        resolve(true);
      }
    };

    BC.onmessageerror = function () {
      reject(false);
    };

    const transformData = transformUserData(userdata);
    loginStoreSetInfo(transformData, true);

    //写入cookie
    Promise.resolve().then(() => setCookie(userdata));

    BC.postMessage(transformData);
    setLocalStorage(userdata);
  });
}

function setLocalStorage(tokenobj: Record<string, any>) {
  if (Object.keys(tokenobj).length === 0) return;
  const transformTokenData = transformToken(tokenobj);

  for (const key in transformTokenData) {
    useLocalStorage(key, transformTokenData[key]);
  }
}

function transformToken(tokenobj: Record<string, any>): ACCESS_OR_REFRESH_TOKEN {
  const binding_token = JSON.parse(tokenobj.bindings[1].tokenJsonStr);
  console.log(tokenobj);
  console.log(binding_token);

  return Object.keys(binding_token).reduce((pre, next) => (pre[next] = binding_token[next]), {});
}

export function transformUserData(userdata: any) {
  // console.log(userdata);
  const profile = userdata.profile ?? userdata;

  const data: USERDATA = {
    userID: profile.userId,
    id: profile.userId,
    avatarUrl: profile.avatarUrl,
    nickname: profile.nickname,
    userinfoData: profile,
  };

  return data;
}
