import request from "../../utils/request";

export function mvVideoDetail(morvid: number | string, vorm: "vid" | "mid" = "mid") {
  console.log(morvid);

  return request({
    url: vorm === "mid" ? "/mv/detail" : "/video/detail",
    params: {
      ...(vorm === "mid" ? { mvid: morvid } : { id: morvid }),
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

export function commentMv(id: number) {
  return request({
    url: "/comment/mv",
    params: {
      id,
    },
  });
}

export function playerVideoPath(id: string) {
  return request({
    url: "/video/url",
    params: {
      id,
    },
  });
}

export function allvideo(id: string) {
  return request({
    url: "/related/allvideo",
    params: {
      id,
    },
  });
}

export function subVideo(vid: string, t: "1" | "0") {
  return request({
    method: "POST",
    url: "/video/sub",
    params: {
      id: vid,
      t,
      timestamp: Date.now(),
    },
  });
}

export function mylinked() {
  return request({
    url: "/playlist/mylike",
  });
}

export function videoDetailInfo(vid: string) {
  return request({
    url: "/video/detail/info",
    params: {
      vid,
    },
  });
}

export async function linked(threadId: string, t: 0 | 1, type: number) {
  return request({
    method: "post",
    url: "/resource/like",
    data: {
      t,
      type,
      id: threadId,
    },
  });
}
