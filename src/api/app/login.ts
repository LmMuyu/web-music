import request from "../../utils/request";

export async function loginStateus() {
  const httpRes = await request({ method: "post", url: "/login/status" });
  const data = httpRes.data;
  return data.code === 200 && data.data.account !== null && data.data.profile !== null;
}

export async function logout() {
  return request({
    method: "post",
    url: "/logout",
  });
}
