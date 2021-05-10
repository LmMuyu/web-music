import request from "../../utils/request";

export function getMusicUrl(id: string) {
  const musicID = String(id).trim();

  return request({
    url: "/song/url",
    method: "GET",
    params: {
      id: musicID,
    },
  });
}
