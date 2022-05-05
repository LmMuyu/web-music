import request from "../../utils/request";

export function topicDetail(tid: number) {
  return request({
    method: "get",
    url: "/topic/detail",
    params: {
      actid: tid,
    },
  });
}

export function topicHotEvent(tid: number) {
  return request({
    url: "/topic/detail/event/hot",
    params: {
      actid: tid,
    },
  });
}
