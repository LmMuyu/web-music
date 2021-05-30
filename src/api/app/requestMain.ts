import request from "../../utils/request";

export function countries() {
  return request({
    method: "GET",
    url: "/countries/code/list",
  });
}
