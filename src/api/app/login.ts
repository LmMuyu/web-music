import request from "../../utils/request";
import store from "../../store";

export async function loginStateus() {
  const isInitStatus = store.getters["login/getInitStatus"];
  const islogin = store.getters["login/getIslogin"];
  console.log("isInitStatus:", isInitStatus);
  console.log("islogin:", islogin);

  try {
    if (!isInitStatus) {
      await request({ method: "post", url: "/login/status" });
    } else {
      throw new Error(isInitStatus);
    }
  } catch (err) {
    console.log(err);
    store.commit("login/setInitStatus", false);
  } finally {
    return islogin;
  }
}

export async function logout() {
  return request({
    method: "post",
    url: "/logout",
  });
}
