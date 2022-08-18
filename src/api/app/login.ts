import store from "../../store";
import request from "../../utils/request";

let islogin = null;

export async function loginStateus() {
  if (islogin !== null) {
    return islogin;
  }

  return await login();
}

export  async function login() {
  try {
    const httpRes = await request({
      method: "post",
      url: "/login/status",
    });

    const data = httpRes.data;
    Promise.resolve(data).then((userdata) => {
      const data = userdata.data;
      if (data.account !== null && data.profile !== null) {
        const userId = data.profile.userId;
        store.commit("login/setUserId", userId);
        store.dispatch("login/setFollows");
        store.dispatch("login/account");
      }
    });
    const res = data.data.code === 200 && data.data.account !== null && data.data.profile !== null;
    islogin === null && (islogin = res);

    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function logout() {
  try {
    await request({
      method: "post",
      url: "/logout",
    });

    islogin = null;
  } catch (error) {
    console.log(error);
  }
}
