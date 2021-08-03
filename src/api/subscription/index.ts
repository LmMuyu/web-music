import request from "../../utils/request";

export function getSubScriptDynamic(lasttime: number = -1) {
  return request({
    url: "/event",
    params: {
      pagesize: 10,
    },
  });
}

export function postLinke(cid: number, threadId: string, t: 0 | 1) {
  return request({
    method: "post",
    url: "/comment/like",
    data: {
      t,
      cid,
      type: 6,
      threadId,
    },
  });
}
