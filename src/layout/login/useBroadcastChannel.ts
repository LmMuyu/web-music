import { nextTick } from "vue";
import store from "../../store";

import { setCookie } from "../../utils/request/response/result";
import { useLocalStorage } from "../../utils/useLocalStorage";

import { ElNotification } from "element-plus";

import { loginStoreSetInfo } from "./login";
import type { USERDATA } from "../../store/type";
import { useRoute } from "vue-router";

type NottificationType = "success" | "warning" | "info" | "error";
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

function openNotification(content: string, title?: string, type: NottificationType = "info") {
  return ElNotification.success({
    type,
    message: content,
    showClose: false,
    ...(title ? { title } : {}),
  });
}

export function mainBCBus(): Promise<USERDATA> {
  const BC = new BroadcastChannel("login");
  console.log("main");

  return new Promise((resolve) => {
    BC.onmessage = function (ev) {
      resolve(ev.data);
    };

    BC.onmessageerror = function () {
      console.error("BroadcastChannel接收到一条无法反序列化的消息!");
    };
  });
}

//登录后跨页面通信
export function loginBCBus(userdata: any): BroadcastChannel {
  const route = useRoute();
  const BC = new BroadcastChannel("login");
  console.log("login");
  console.log(userdata);

  const closeBcWatch = () => BC.close();
  const _resolve = Promise.resolve();
  store.commit("login/pushWatchFn", ["stopwatch", closeBcWatch]);

  const transformData = transformUserData(userdata);
  loginStoreSetInfo(transformData, true);
  _resolve.then(() => setCookie(userdata));

  BC.postMessage(transformData);
  setLocalStorage(userdata);

  nextTick(() => openNotification("欢迎回来" + transformData.nickname, null, "success"));

  const path = (route && route.path) ?? "/login";
  if (path.indexOf("/login") > -1) {
    window.close();
  }

  return BC;
}

function setLocalStorage(tokenobj: Record<string, any>) {
  if (Object.keys(tokenobj).length === 0) return;
  const transformTokenData = transformToken(tokenobj);
  console.log(transformTokenData);

  for (const key in transformTokenData) {
    useLocalStorage(key, transformTokenData[key]);
  }
}

function transformToken(tokenobj: Record<string, any>): ACCESS_OR_REFRESH_TOKEN {
  const binding_token = JSON.parse(JSON.stringify(tokenobj.bindings[1].tokenJsonStr));
  return Object.keys(binding_token).reduce((pre, next) => (pre[next] = binding_token[next]), {});
}

export function transformUserData(userdata: any) {
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
