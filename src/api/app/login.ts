import request from "../../utils/request";

let islogin = null;

export async function loginStateus() {
  if (islogin !== null) {
    return islogin;
  }

  const httpRes = await request({ method: "post", url: "/login/status" });
  const data = httpRes.data;
  const res = data.data.code === 200 && data.data.account !== null && data.data.profile !== null;
  islogin === null && (islogin = res);

  return res;
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
