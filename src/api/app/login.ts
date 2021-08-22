import request from "../../utils/request";

let initlogin = false;

export async function loginStateus() {
  if (!initlogin) {
    try {
      initlogin = true;
      await request({ url: "/login/status" });
    } catch (err) {
      console.log(err);
    }
  }
}

export function logout() {
  return request({
    method: "post",
    url: "/logout",
  });
}
