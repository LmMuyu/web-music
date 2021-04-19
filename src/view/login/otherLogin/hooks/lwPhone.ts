import { toRaw } from "@vue/reactivity";
import { cellphone } from "../../../../api/login";
import { ElMessage } from "element-plus";

type Captcha = {
  countries: string;
  phoneNumber: string;
};

export async function lwPhone(params: object, resultFn?: Function) {
  let { phoneNumber: phone, countries: ctcode }: Captcha = toRaw(
    params
  ) as Captcha;
  if (!phone) {
    return;
  }

  ctcode = ctcode.substr(1);
  const res = await cellphone(phone, ctcode);

  if (!res.data.hasPassword) {
    ElMessage.warning({
      message: "当前账号未注册!",
      type: "warning",
    });
  }

  resultFn && resultFn(res.data);
}
