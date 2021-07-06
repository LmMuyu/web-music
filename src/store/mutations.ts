import { reactive } from "@vue/reactivity";

import type { State, UserInfo } from "./type";
import type { MusicDetailOption } from "../utils/musicDetail";
import { useLocalStorage } from "../utils/useLocalStorage";

function setLocalStorage(token: number, commitInfo: UserInfo) {
  if (!token) return;
  const strCommitInfo = JSON.stringify(commitInfo);

  useLocalStorage("token", String(token));
  useLocalStorage("userInfo", strCommitInfo);
}

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },

  setUserInfo(state: State, commitInfo: UserInfo) {
    setLocalStorage(commitInfo.token, commitInfo); //写入local storage
    state.userInfo = reactive<UserInfo>(commitInfo); //写入stat
  },

  setMusicInfo(store: State, musicInfo: MusicDetailOption) {
    store.musicInfo = musicInfo;
  },
};
