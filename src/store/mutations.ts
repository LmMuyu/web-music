import { reactive } from "@vue/reactivity";
import type { State, UserInfo } from "./type";
import type { MusicDetailOption } from "../utils/musicDetail";

async function conversionData(commit: string) {
  localStorage.setItem("userInfo", commit);
}

function setLocalStorage(token: number, commitInfo: UserInfo) {
  console.log(token);

  if (!token) {
    return;
  }
  localStorage.setItem("token", String(token));
  const strCommitInfo = JSON.stringify(commitInfo);
  conversionData(strCommitInfo);
}

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },
  setUserInfo(state: State, commitInfo: UserInfo) {
    Promise.resolve(() => setLocalStorage(commitInfo.token, commitInfo));
    state.userInfo = reactive<UserInfo>(commitInfo);
  },
  setMusicInfo(store: State, musicInfo: MusicDetailOption) {
    store.musicInfo = musicInfo;
  },
};
