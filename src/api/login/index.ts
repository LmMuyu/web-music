import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";
import type { Captcha } from "../../view/login/otherLogin/type";

export function captchaSend(
  config: AxiosRequestConfig,
  ryphoneBack?: Function
) {
  config.method = config.method ? config.method : "POST";

  let { phone, ctcode }: Captcha = config.params;
  ctcode = ctcode.substr(1);

  return request({});
}


//验证手机号有没有注册
export async function cellphone(phone: string, countrycode: string) {
  return await request({
    method: "POST",
    url: "/cellphone/existence/check",
    params: {
      phone,
      countrycode,
    },
  });
}
