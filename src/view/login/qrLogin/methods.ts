import { inject, ref } from "vue";

import {
  checkStatus,
  getQrCreate,
  getQrKey,
} from "../../../api/login/qrCodeLogin";

import type { AxiosResponse } from "axios";
import { STATUS } from "../enum";
import { ElMessage } from "element-plus";
import Observer from "../../../utils/observer/Observer";

interface LoginData {
  code: number;
  cookie: string;
  message: string;
}

interface CurrComp {
  value: string;
}

export function touchQrLogin(currentInstanceName: string) {
  const currComp: CurrComp = inject("currCompId")!;

  const qrBase64 = ref("");
  const qrexpired = ref(false);

  //获取二维码key
  getQrKey({
    url: "/login/qr/key",
  }).then(({ data }) => {
    const unikey = data.data.unikey;

    QrCreate(unikey);
  });

  //获取二维码图片
  async function QrCreate(key: string) {
    const result = await getQrCreate({
      url: "/login/qr/create",
      params: {
        qrimg: "base64",
        key,
      },
    });

    const qrimg = result.data.data.qrimg;

    if (!!qrBase64.value) qrBase64.value = "";
    qrBase64.value = qrimg.qrimg;

    checkLoginStatus(key);
  }

  //轮询二维码检测扫码状态
  async function checkLoginStatus(key: string) {
    let times: NodeJS.Timeout | null = null;
    //防止用户扫二维码多次
    if (times) return;

    times = setInterval(async () => {
      if (currComp && currComp.value === "qrlogin") {
        const checkRes = await checkStatus({
          url: "/login/qr/check",
          params: { key },
        });

        const { data }: AxiosResponse<LoginData> = checkRes;

        loginReslutDealWith(data.code, times, data.code === 803 ? data : "");
      }
    }, 3000);

    Observer.on(currentInstanceName, times);
  }

  //根据返回的code来选择对应的逻辑
  function loginReslutDealWith(
    code: number,
    times: any,
    successData?: LoginData | string
  ) {
    switch (code) {
      case STATUS.EXPIRED:
        qrexpired.value = true;
        break;
      case STATUS.WAIT:
        break;
      case STATUS.TODECONFIRMED:
        break;
      case STATUS.RESLUT:
        clearTimeout(times);
        times = null;

        if (!!successData && typeof successData !== "string") {
          loginResult(successData.cookie);

          ElMessage({
            message: successData.message,
            type: "success",
          });
        }

        break;
      default:
        return;
    }
  }

  function loginResult(cookie: string) {
    qrBase64.value = "";
  }

  return {
    qrBase64,
    qrexpired,
  };
}
