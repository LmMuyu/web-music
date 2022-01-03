import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

export function captchaSend(config: AxiosRequestConfig) {
  config.method = config.method ? config.method : "POST";

  let { phone, ctcode } = config.data;
  ctcode = String(ctcode).substring(1);

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("ctcode", ctcode);

  return request({
    url: config.url,
    method: config.method,
    data: formData,
  });
}

//验证手机号有没有注册
export async function cellphone(formData: FormData) {
  return await request({
    method: "POST",
    url: "/cellphone/existence/check",
    data: formData,
  });
}

export function loginCellphone(formData: FormData) {
  return request({
    method: "POST",
    url: "/login/cellphone",
    data: formData,
  });
}

export function getBannerImg() {
  return request({
    url: "/banner",
    params: {
      type: "pc",
    },
  });
}
