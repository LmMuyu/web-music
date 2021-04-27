import request from "../../utils/request";

export function toplistData() {
  return request({
    method: "GET",
    url: "/toplist",
  });
}

export function listDetail(id: number) {
  return request({
    method: "GET",
    url: "/playlist/detail",
    params: {
      id,
    },
  });
}
