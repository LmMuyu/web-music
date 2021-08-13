import { AxiosRequestConfig } from "axios";
import { isType } from "../../utils/methods";
import request from "../../utils/request";
import type { Captcha } from "../../view/login/otherLogin/type";

export function captchaSend(config: AxiosRequestConfig) {
  config.method = config.method ? config.method : "POST";

  let { phone, ctcode }: Captcha = config.data;
  ctcode = String(ctcode).substr(1);

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


export function getBannerImg(){
  return request({ 
    url:"/banner",
    params:{
      type:"pc"
    }
  })
}