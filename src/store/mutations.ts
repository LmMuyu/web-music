import { reactive } from "@vue/reactivity";
import { State, UserInfo } from "./type";
import "src/utils/worker/md5.min.js";

async function conversionMd5Data(commit: string) {
  const hash = await md5(commit);
  localStorage.setItem("infoCommit", hash);
}

function setLocalStorage(token: number, commitInfo: UserInfo) {
  if (!token) {
    return;
  }
  const strCommitInfo = JSON.stringify(commitInfo);

  localStorage.setItem("token", String(token));
  conversionMd5Data(strCommitInfo);
}

export default {
  countriesCode(state: State, commit: any) {
    state.countriesCode = commit;
  },
  setUserInfo(state: State, commitInfo: UserInfo) {
    Promise.resolve(() => setLocalStorage(commitInfo.token, commitInfo));
    state.userInfo = reactive<UserInfo>(commitInfo);
  },
};
