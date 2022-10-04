import request from "../../utils/request";

export function songDetail(id: number) {
  return request({
    url: "/playlist/detail",
    params: {
      id,
    },
  });
}

export function songDetailAll(id: number, offset = 1) {
  return request({
    url: "/playlist/track/all",
    params: {
      id,
      limit: 10,
      offset,
    },
  });
}

//t : 类型,1:收藏,2:取消收藏 id : 歌单 id
export function subscribe(id: number, t: 1 | 2 | any) {
  console.log(t);

  if (t != 1 && t != 2) {
    console.error("t : 类型,1:收藏,2");
    return undefined;
  }

  return request({
    method: "POST",
    url: "/playlist/subscribe",
    data: {
      id,
      t,
    },
  });
}
