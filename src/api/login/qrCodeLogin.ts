import request from "../../utils/request";

export function getQrKey() {
  return request({ url: "/login/qr/key" });
}

export function getQrCreate(key: string) {
  return request({
    url: "/login/qr/create",
    params: {
      key,
      qrimg: true,
    },
  });
}

export function checkStatus(key: string) {
  return request({
    url: "/login/qr/check",
    params: {
      key,
    },
  });
}
