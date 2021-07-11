import formDataAppend from "../../../../utils/setFormData";
import request from "../../../../utils/request";

interface PARAMS {
  phoneNumber: string;
  password: string;
  countries?: string;
}

export async function login(
  { password, phoneNumber: phone, countries }: PARAMS,
  userDataRetFn: Function
) {
  try {
    countries = countries?.substring(1);

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
  } catch (error) {
    Promise.resolve().then(() => {
      const code = String(error).match(/code\s(\d+)/)?.[1];
      console.log(code);
    });
  }
}
