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

export function getVideoComment(
  id: string,
  offset: number = 1,
  before: number = null,
  limit: number = 20
) {
  return request({
    url: "/comment/video",
    params: {
      id,
      limit,
      offset: offset * limit,
      before: before && before,
    },
  });
}

export function followUser(uid: number, t: number) {
  return request({
    url: "/follow",
    params: {
      id: uid,
      t,
    },
  });
}

export function simiMv(mvid: number) {
  return request({
    url: "/simi/mv",
    params: {
      mvid,
    },
  });
}
