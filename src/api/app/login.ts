import request from "../../utils/request";

export function loginStateus() {
  return request({ method: "post", url: "/login/status" });
}

export async function logout() {
  return request({
    method: "post",
    url: "/logout",
  });
}
