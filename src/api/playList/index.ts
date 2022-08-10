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
      ids: String(ids),
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

export function userRecord(uid: number, type?: "0" | "1") {
  type = type || "0";
  return request({
    url: "/user/record",
    params: {
      uid,
      type,
    },
  });
}

export async function commentMusic(
  id: number | string,
  offset: number = 1,
  before?: number,
  limit: number = 20,
  type: "music" | "mv" | "video" = "music"
) {
  return request({
    url: "/comment/" + type,
    params: {
      id,
      limit,
      offset: (offset - 1) * limit,
      ...(before ? { before } : {}),
      timestamp: Date.now(),
    },
  });
}
