import { captchaSend } from "../../../../api/login/index";
import { ElMessage } from "element-plus";

export function onVerificationCode(
  phone: string,
  countDownFn: Function,
  ctcode: string
) {
  const isTimer = countDownFn();
  if (isTimer) return;

  captchaSend({
    url: "/captcha/sent",
    data: {
      phone,
      ctcode,
    },
  });
}
