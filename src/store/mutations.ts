import { reactive } from "@vue/reactivity";
import { State, UserInfo } from "./type";

async function conversionMd5Data(commit: string) {
  const blob = new Blob([commit]);

  const reader = new FileReader();
  reader.onload = function () {
    console.log(reader.result);
  };

  reader.readAsText(blob);
}

function setLocalStorage(token: number, commitInfo: UserInfo) {
  if (!token) {
    return;
  }
  localStorage.setItem("token", String(token));
  const strCommitInfo = JSON.stringify(commitInfo);
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
