import request from "../../utils/request";

export function getUserInfoData(uid: number) {

  return request({
    method: "GET",
    url: "/user/detail",
    params: {
      uid,
    },
  });
}