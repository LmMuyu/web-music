import { useStore } from "vuex";

import { useLocalStorage } from "../../../utils/useLocalStorage";

import type { UserInfo } from "../../../store/type";
import { ElNotification } from "element-plus";

type NottificationType = "success" | "warning" | "info" | "error";

function openNotification(content: string, title?: string, type: NottificationType = "info") {
  return ElNotification.success({
    type,
    message: content,
    showClose: false,
    ...(title ? { title } : {}),
  });
}

//登录后跨页面通信
export default function loginBCBus(isCurLoginPage: boolean = false, data?: any) {
  const store = useStore();
  const BC = new BroadcastChannel("login");

  function portMess(data: any, BC: BroadcastChannel) {
    BC.postMessage(data);
  }

  if (isCurLoginPage) {
    BC.onmessage = function (ev) {
      if (ev.data === "close_window") {
        window.close();
      }
    };

    portMess(data, BC);
  } else {
    return new Promise((resolve, inject) => {
      BC.onmessage = function (ev) {
        const userdata = ev.data;
        console.log(userdata);

        // setLocalStorage(info.token, info); //写入local storage
        store.commit("login/switchStatus", true);
        store.commit("login/setUserInfo", userdata);

        portMess("close_window", BC);
        resolve(userdata);

        openNotification("话题哇哇哇哇");
      };

      BC.onmessageerror = function () {
        inject("BroadcastChannel接收到一条无法反序列化的消息!");
      };
    });
  }
}

function setLocalStorage(token: number, commitInfo: UserInfo) {
  if (!token) return;

  const strCommitInfo = JSON.stringify(commitInfo);

  useLocalStorage("token", String(token));
  useLocalStorage("userinfo", strCommitInfo);
}
