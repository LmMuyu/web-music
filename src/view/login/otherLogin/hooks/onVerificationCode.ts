import { captchaSend } from "../../../../api/login/index";
import { ElMessage } from "element-plus";

export function onVerificationCode(
  phone: string,
  countDownFn: Function,
  ctcode: string
) {
  if (!phone) {
    ElMessage.error({
      message: "请输入手机号码",
      type: "error",
    });

    return;
  }
  countDownFn();

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("ctcode", ctcode);

  captchaSend(
    {
      url: "/captcha/sent",
      params: formData,
    },
    ({ hasPassword, nickname }: { hasPassword: boolean; nickname: string }) => {
      console.log(hasPassword + "-----" + nickname);
    }
  );
}
