import request from "../../../../utils/request";
import append from "../../../../utils/setFormData";

export function vvvode(phnoe: string, captcha: number, ctcode?: string) {
  ctcode = ctcode && ctcode.substring(1).trim();

  const formData = append({
    phnoe,
    captcha,
    ctcode,
  });

  return request({
    url: "/captcha/verify",
    method: "POST",
    data: formData,
  });
}
