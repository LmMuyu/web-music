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

export function getPlaylistCatlist() {
  return request({
    url: "/playlist/catlist",
  });
}

export function highqualityTags() {
  return request({
    url: "/playlist/highquality/tags",
  });
}

export function topPlaylist(tag: string = "全部") {
  return request({
    url: "/top/playlist",
    params: {
      cat: tag,
    },
  });
}
