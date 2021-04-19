import { captchaSend } from "../../../../api/login/index";
import { ElMessage } from "element-plus";

export function onVerificationCode(
  phone: string,
  countDownFn: Function,
  ctcode?: string
) {
  if (!phone) {
    ElMessage.error({
      message: "请输入手机号码",
      type: "error",
    });

    return;
  }

  countDownFn();

  // captchaSend(
  //   {
  //     url: "/captcha/sent",
  //     params: {
  //       phone,
  //       ctcode,
  //     },
  //   },
  //   ({ hasPassword, nickname }: { hasPassword: boolean; nickname: string }) => {
  //     console.log(hasPassword + "-----" + nickname);
  //   }
  // );
}
