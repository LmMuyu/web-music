import { nextTick } from "vue";
import route from "../../../routes";
import store from "../../../store";

import { setCookie } from "../../../utils/request/response/result";
import { useLocalStorage } from "../../../utils/useLocalStorage";

import { ElNotification } from "element-plus";

import type { USERDATA } from "../../../store/type";
import { AxiosResponse } from "axios";

type NottificationType = "success" | "warning" | "info" | "error";
type ExtractPickForValue<T, K extends keyof T> = T[K];

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

function dispatchBc<T extends BroadcastChannel>(BC: T): ExtractPickForValue<T, "postMessage"> {
  return;
}

//登录后跨页面通信
export default function loginBCBus(
  isloginPages: boolean, //判断是否是登录页面
  data?: any
): Promise<DispatchBcRet> {
  const BC = new BroadcastChannel("login");
  const closeBcWatch = () => BC.close();
  store.commit("login/pushWatchFn", ["stopwatch", closeBcWatch]);

  function sendEmitPost(): PromiseExtractPickValue {
    return BC.postMessage.bind(BC);
  }

  return new Promise((resolve, reject) => {
    if (isloginPages) {
      BC.onmessage = function (ev) {
        if (ev.data === "close_window" && route.currentRoute.value.path === "/login") {
          window.close();
        }
      };

      return data
        ? resolve({ postMessage: sendEmitPost(), userdata: data })
        : resolve({ postMessage: sendEmitPost() });
    } else {
      const _resolve = Promise.resolve;

      BC.onmessage = function (ev) {
        const userdata = ev.data;
        console.log(userdata);
        const transformData = transformUserData(userdata);

        store.commit("login/switchStatus", true);
        store.commit("login/setUserInfo", userdata);
        setLocalStorage(userdata, transformData); //写入local storage

        _resolve().then(() => setCookie(userdata as AxiosResponse<any>));
        sendEmitPost()("close_window");

        resolve({ postMessage: sendEmitPost(), userdata: transformData });
        nextTick(() => openNotification("欢迎回来" + transformData.nickname, null, "success"));
      };

      BC.onmessageerror = function () {
        reject("BroadcastChannel接收到一条无法反序列化的消息!");
      };
    }
  });
}

function setLocalStorage(tokenobj: Record<string, any>, userData: USERDATA) {
  if (Object.keys(tokenobj).length === 0) return;
  const strUserData = JSON.stringify(userData);

  const transformTokenData = transformToken(tokenobj);

  for (const key in transformTokenData) {
    useLocalStorage(key, transformTokenData[key]);
  }

  useLocalStorage("userinfo", strUserData);
}

function transformToken(tokenobj: Record<string, any>): ACCESS_OR_REFRESH_TOKEN {
  const binding_token = JSON.parse(JSON.stringify(tokenobj.bindings[1].tokenJsonStr));

  const token = tokenobj.token;
  const access_token = binding_token.access_token;
  const refresh_token = binding_token.refresh_token;

  return {
    token,
    access_token,
    refresh_token,
    tokenJsonStr: tokenobj.bindings[1].tokenJsonStr,
    tokenStrObj: JSON.stringify(tokenobj),
  };
}

function transformUserData(userdata: any) {
  const profile = userdata.profile;

  const data: USERDATA = {
    userID: profile.userId,
    id: profile.userId,
    avatarUrl: profile.avatarUrl,
    nickname: profile.nickname,
    userinfoData: profile,
  };

  return data;
}
