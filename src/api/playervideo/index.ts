import request from "../../utils/request";

export function mvVideoDetail(mvid: number) {
  return request({
    url: "/mv/detail",
    params: {
      mvid,
    },
  });
}

export function mvPath(mvid: number, ratio: number) {
  return request({
    url: "/mv/url",
    params: {
      id: mvid,
      r: ratio,
    },
  });
}

export function personalizedMv() {
  return request({
    url: "/personalized/mv",
  });
}

export function timelineVideo(offset: number = 0) {
  return request({
    url: "/video/timeline/recommend",
    params: {
      offset,
    },
  });
}
