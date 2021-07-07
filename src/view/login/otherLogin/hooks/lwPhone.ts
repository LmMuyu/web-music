import { toRaw } from "@vue/reactivity";
import { cellphone } from "../../../../api/login";
import { ElMessage } from "element-plus";
import Inspection from "./inspection";

type Captcha = {
  countries: string;
  phoneNumber: string;
};

export async function lwPhone(params: object, resultFn?: Function) {
  let { phoneNumber: phone, countries: ctcode }: Captcha = toRaw(
    params
  ) as Captcha;

  if (!phone) return;

  phone = String(phone).trim();
  ctcode = ctcode.substr(1);

  const inspection = new Inspection();
  const whileres = inspection.whileInspection({
    Inob: phone,
    type: "acc",
  });

  if (!whileres) {
    return;
  }

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("ctcode", ctcode);

  const res = await cellphone(formData);

  if (!res.data.hasPassword) {
    ElMessage.warning({
      message: "当前账号未注册!",
      type: "warning",
    });
  }

  resultFn?.(res.data);
}
