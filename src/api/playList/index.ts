import request from "../../utils/request";

export function getMusicUrl(id: string) {
  return request({
    url: "/song/url",
    method: "GET",
    params: {
      id,
    },
  });
}

export function getMusicDetail(ids: string) {
  return request({
    url: "/song/detail",
    params: {
      ids,
    },
  });
}

export function whetherMusic(id: string) {
  return request({
    url: "/check/music",
    params: {
      id,
    },
  });
}

export function getLyrics(id: string) {
  return request({
    url: "/lyric",
    params: {
      id,
    },
  });
}

export function getRecord(uid: number, type: 1 | 0 = 1) {
  return request({
    url: "/user/record",
    params: {
      uid,
      type,
    },
  });
}
