import request from "../../utils/request";

export function mvRecommend() {
  return request({ url: "/personalized/mv" });
}

export function getMvUrl(id: number, r: number = 1080) {
  return request({
    url: "/mv/url",
    params: { id, r },
  });
}
