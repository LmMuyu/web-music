import request from "../../utils/request";

export function songDetail(id: number) {
  return request({
    url: "/playlist/detail",
    params: {
      id,
    },
  });
}
