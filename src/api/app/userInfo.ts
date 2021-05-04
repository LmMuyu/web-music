import request from "../../utils/request";

export function getUserInfoData(uid: number) {
  console.log(uid);

  return request({
    method: "GET",
    url: "/user/detail",
    params: {
      uid,
    },
  });
}
