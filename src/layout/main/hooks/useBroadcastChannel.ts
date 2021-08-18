import { useStore } from "vuex";
import { reactive } from "vue";

import { useLocalStorage } from "../../../utils/useLocalStorage";

import type { UserInfo } from "../../../store/type";
import type { Ref } from "vue";

//登录后跨页面通信
export const BCBus = (countRef: Ref<boolean>, negate: () => boolean) => {
  let store = useStore();
  if (store.getters.getStatus === 200) return;

  const InfoCard = reactive({
    userInfo: {},
    countRef,
    negate,
  });

  const BC = new BroadcastChannel("login");

  BC.onmessage = async function (ev) {
    const info = ev.data;

    setLocalStorage(info.token, info); //写入local storage
    BC.postMessage(""); //通知登录页面可以跳转到主页面了
  };

  BC.onmessageerror = function () {
    throw new Error("BroadcastChannel接收到一条无法反序列化的消息!");
  };

  return InfoCard;
};

function setLocalStorage(token: number, commitInfo: UserInfo) {
  if (!token) return;

  const strCommitInfo = JSON.stringify(commitInfo);

  useLocalStorage("token", String(token));
  useLocalStorage("userInfo", strCommitInfo);
}
