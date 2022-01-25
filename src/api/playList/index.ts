import request from "../../utils/request";
import stroe from "../../store";
import LRU from "../../layout/explore/LRUCache";
import { disposeLRU } from "./dispose";

const lru = new LRU();
let commentMusicId = 0;

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
  id: number,
  offset: number = 1,
  before?: number,
  limit: number = 20
) {
  if (commentMusicId !== id) {
    lru.clear();
    commentMusicId = id;
  }

  const dataNode = disposeLRU(lru, offset);
  console.log(dataNode);

  if (dataNode !== -1) {
    return dataNode.value;
  }

  const data = await request({
    url: "/comment/music",
    params: {
      id,
      limit,
      offset: (offset - 1) * limit,
      ...(before ? { before } : {}),
    },
  });

  disposeLRU(lru, offset, data);
  console.log(lru.mapAllData);

  return data;
}
