import request from "../../utils/request";

export function groupVideoList() {
  return request({
    url: "/video/group/list",
  });
}

export function getVideoGroup(id: number, offset: number = 0) {
  return request({
    url: "/video/group",
    params: {
      id,
      offset,
      timestamp: Date.now(),
    },
  });
}
