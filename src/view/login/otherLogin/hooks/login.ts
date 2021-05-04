import { toRaw } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import request from "../../../../utils/request";
import formDataAppend from "../../../../utils/setFormData";

interface PARAMS {
  phoneNumber: string;
  password: string;
  verificationCode: string;
  countries?: string;
}

type TYPE = "error" | "info" | "success" | "warning";

function showMessage(type: TYPE, message: string) {
  ElMessage({
    type,
    message,
  });
}

export async function login(params: PARAMS, userDataRetFn: Function) {
  let {
    phoneNumber: phone,
    password,
    verificationCode,
    countries = "+86",
  }: PARAMS = toRaw(params);
  countries = countries?.substring(1);

  if (!phone) {
    showMessage("error", "请输入手机号");
    return;
  } else if (!password) {
    showMessage("error", "请输入密码");
    return;
  } else if (!verificationCode) {
    showMessage("error", "输入验证码");
    return;
  }

  const verif = await formDataAppend({
    phone,
    captcha: verificationCode,
    ctcode: countries,
  });

  const errorReg = /code\s(\d+)/;

  try {
    const verify = await request({
      url: "/captcha/verify",
      method: "post",
      data: verif,
    });

    if (verify.data.data) {
      const worker = new Worker("/src/utils/worker/password.js");
      worker.onerror = function (err) {
        console.error(err);
      };

      worker.postMessage(password);

      worker.onmessage = async function ({ data }) {
        worker.terminate();
        const formData = await formDataAppend({
          phone,
          countrycode: countries,
          md5_password: data,
        });

        const res = await request({
          url: "/login/cellphone",
          method: "POST",
          data: formData,
        });

        userDataRetFn(res);
      };
    }
  } catch (error) {
    Promise.resolve().then(() => {
      const code = String(error).match(errorReg)?.[1];

      switch (code) {
        case "503":
          showMessage("error", "验证码错误");
          return;
        default:
          return;
      }
    });
  }
}
