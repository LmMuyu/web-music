import request from "../../utils/request";

export function songDetail(id: number) {
  return request({
    url: "/playlist/detail",
    params: {
      id,
    },
  });
}

export function songDetailAll(id: number, offset = 1) {
  return request({
    url: "/playlist/track/all",
    params: {
      id,
      limit: 10,
      offset,
    },
  });
}
