import request from "../../utils/request";

export function getUserInfoData(uid: number) {
  return request({
    method: "POST",
    url: "/user/detail",
    data: {
      uid,
    },
  });
}
