import request from "../../utils/request";

export function topicDetail(tid: number, limit: number = 20, offset: number = 0) {
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

export function hotTopic(tid: number, limit: number = 20, offset: number = 0) {
  return request({
    url: "/hot/topic",
    params: {
      tid,
      limit,
      offset,
    },
  });
}
