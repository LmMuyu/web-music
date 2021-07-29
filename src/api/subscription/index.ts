import request from "../../utils/request";

export function getSubScriptDynamic(uid: number) {
  return request({
    url: "/user/event",
    params: {
      limit: 10,
      uid,
    },
  });
}
