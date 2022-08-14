import request from "../../utils/request";

export function latestmv(area: string, limit: number = 6) {
  return request({
    url: "/mv/first",
    params: {
      area,
      limit,
    },
  });
}

export function hotMv(limit: number = 8) {
  return request({
    url: "/mv/all",
    params: {
      limit,
      order: "最热",
    },
  });
}

export function exclusiveMv(limit: number = 8) {
  return request({
    url: "/mv/exclusive/rcmd",
    params: {
      limit,
    },
  });
}

export function topMv(limit: number = 10, area: string = "") {
  return request({
    url: "/top/mv",
    params: {
      area,
      limit,
    },
  });
}
