import request from "../../utils/request";
import stroe from "../../store";

export function getMusicUrl(id: string) {
  return request({
    url: "/song/url",
    method: "GET",
    params: {
      id,
    },
  });
}

export async function getMusicDetail(ids: string) {
  const musicMaps = stroe.getters["toplist/retListMaps"];

  if (musicMaps.has(ids)) {
    return {
      isExistMaps: true,
      data: musicMaps.get(ids),
    };
  } else {
    return {
      isExistMaps: false,
      data: await request({
        url: "/song/detail",
        params: {
          ids,
        },
      }),
    };
  }
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
