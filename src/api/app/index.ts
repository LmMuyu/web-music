import request from "../../utils/request";

export function idsbatch(ids: string) {
  return request({
    url: "/batch" + `?/api/v2/banner/get={ids:${ids}}`,
  });
}
