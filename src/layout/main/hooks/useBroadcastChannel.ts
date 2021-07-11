import { Ref } from "vue";

import { getUserInfoData } from "../../../api/app/userInfo";
import { UserInfo } from "../../../store/type";
import { useLocalStorage } from "../../../utils/useLocalStorage";

import {} from "../../../view/login/login";

interface BCBUSOptions {
  userInfo: {};
  asideCard: Ref<boolean> | boolean;
  negate: () => void;
}

export const BCBus = (InfoCard: BCBUSOptions) => {
  const BC = new BroadcastChannel("login");

  BC.onmessage = function (ev) {
    BC.postMessage(""); //发送信号销毁登录框

    const info = ev.data;
    rearStandUserdata(InfoCard.negate, info);
  };

  BC.onmessageerror = function () {
    throw new Error("BroadcastChannel接收到一条无法反序列化的消息!");
  };

  async function rearStandUserdata(negate: Function, payload: any) {
    const userinfoData = payload.userinfoData;

    const infoData = await getUserInfoData(userinfoData.userID); //通过账号ID查找信息
    userinfoData.userInfoData = infoData.data.profile;

    setUserInfo(userinfoData);

    // state.commit("setUserInfo", userinfoData);
    negate();
  }

  function setUserInfo(commitInfo: UserInfo) {
    setLocalStorage(commitInfo.token, commitInfo); //写入local storage
  }

  function setLocalStorage(token: number, commitInfo: UserInfo) {
    if (!token) return;

    const strCommitInfo = JSON.stringify(commitInfo);

    useLocalStorage("token", String(token));
    useLocalStorage("userInfo", strCommitInfo);
  }
};
