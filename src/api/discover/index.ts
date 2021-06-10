import request from "../../utils/request";

export function getCatlist(
  catlist: Array<{ tagName: string; area: string }>,
  limit: number
) {
  return Promise.all(
    catlist.map((v) =>
      request({
        method: "get",
        url: "/album/new",
        params: {
          limit,
          area: v.area,
        },
      })
    )
  );
}
