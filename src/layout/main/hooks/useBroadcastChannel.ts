import { nextTick } from "vue";
import route from "../../../routes";
import store from "../../../store";

import { useLocalStorage } from "../../../utils/useLocalStorage";

import { ElNotification } from "element-plus";

import type { USERDATA } from "../../../store/type";

type NottificationType = "success" | "warning" | "info" | "error";

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

//登录后跨页面通信
export default function loginBCBus(
  isloginPages: boolean, //判断是否是登录页面
  data?: any
): Promise<{ portMess: (data: any) => void; userdata?: any }> {
  const BC = new BroadcastChannel("login");
  const closeBcWatch = () => BC.close();

  function portMess(data: any) {
    BC.postMessage(data);
  }

  store.commit("login/pushWatchFn", ["stopwatch", closeBcWatch]);

  return new Promise((resolve, reject) => {
    if (isloginPages) {
      BC.onmessage = function (ev) {
        if (ev.data === "close_window" && route.currentRoute.value.path === "/login") {
          window.close();
        }
      };

      if (data) {
        portMess(data);
      } else {
        resolve({ portMess });
      }
    } else {
      console.log("loginWindowChannel");
      BC.onmessage = function (ev) {
        const userdata = ev.data;
        const transformData = transformUserData(userdata);
        setLocalStorage(userdata, transformData); //写入local storage
        store.commit("login/switchStatus", true);
        store.commit("login/setUserInfo", userdata);

        portMess("close_window");
        resolve({ portMess, userdata: transformData });

        nextTick(() => {
          openNotification("话题哇哇哇哇", null, "success");
        });
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
