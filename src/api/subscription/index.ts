import request from "../../utils/request";

export function getSubScriptDynamic(lasttime: number = -1) {
  return request({
    url: "/event",
    params: {
      pagesize: 10,
    },
  });
}
