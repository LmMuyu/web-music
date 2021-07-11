import { Ref } from "vue";

import { useLocalStorage } from "../../../utils/useLocalStorage";
import { getUserInfoData } from "../../../api/app/userInfo";

import type { UserInfo } from "../../../store/type";

interface BCBUSOptions {
  userInfo: {};
  countRef: Ref<boolean> | boolean;
  negate: () => void;
}

export const BCBus = (InfoCard: BCBUSOptions) => {
  const BC = new BroadcastChannel("login");

  BC.onmessage = function (ev) {
    BC.postMessage(""); //发送信号销毁登录框

    const info = ev.data;

    rearStandUserdata(InfoCard, InfoCard.negate, info);
  };

  BC.onmessageerror = function () {
    throw new Error("BroadcastChannel接收到一条无法反序列化的消息!");
  };

  async function rearStandUserdata(
    InfoCard: BCBUSOptions,
    negate: Function,
    payload: any
  ) {
    const infoData = await getUserInfoData(payload.userID); //通过账号ID查找信息
    const setInfoData = Object.assign(payload, {
      userinfoData: infoData.data.profile,
    });

    InfoCard.userInfo = setInfoData.userinfoData;
    setUserInfo(setInfoData);

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
