import request from "../../utils/request";

export function cloudSearch(keywords: string, type: string) {
  return request({
    url: "/cloudsearch",
    params: {
      keywords,
      type,
    },
  });
}
