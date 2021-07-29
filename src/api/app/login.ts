import request from "../../utils/request";

let initlogin = false;

export async function loginStateus() {
  if (!initlogin) {
    await request({ url: "/login/status" });
    initlogin = true;
  }
}
