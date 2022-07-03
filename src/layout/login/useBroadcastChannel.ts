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

const BCLists = [];

function PThen() {
  return Promise.resolve();
}

export function mainBCBus(): Promise<USERDATA> {
  const BC = BCLists[0] || (new BroadcastChannel("login") && PThen().then(() => (BCLists[0] = BC)));
  BCLists[0] = BC;
  return new Promise((resolve) => {
    BC.onmessage = function (ev) {
      const userInfo = ev.data as USERDATA;
      resolve(userInfo);
      BC.postMessage("close_curr_page");
      nextTick(() => openNotification("欢迎回来" + userInfo.nickname, null, "success"));
    };

    BC.onmessageerror = function () {
      console.error("BroadcastChannel接收到一条无法反序列化的消息!");
    };
  });
}

//登录后跨页面通信
export function loginBCBus(userdata: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const BC =
      BCLists[1] || (new BroadcastChannel("login") && PThen().then(() => (BCLists[1] = BC)));
    console.log(BCLists);

    BC.onmessage = function (ev) {
      const msg = ev.data;
      if (msg === "close_curr_page") {
        resolve(true);
        window.close();
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
