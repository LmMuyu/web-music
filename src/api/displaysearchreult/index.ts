import request from "../../utils/request";

export function cloudSearch(
  keywords: string,
  type: string,
  limit: number = 30,
  offset: number = 1
) {
  return request({
    url: "/cloudsearch",
    params: {
      keywords,
      type,
      limit,
      offset: (offset - 1) * limit,
      timestamp: Date.now(),
    },
  });
}
