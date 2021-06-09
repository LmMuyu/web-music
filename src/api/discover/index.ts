import request from "../../utils/request";

export function getCatlist(catlist: Array<{ tagName: string; area: string }>) {
  return Promise.all(
    catlist.map((v) =>
      request({
        method: "get",
        url: "/album/new",
        params: {
          limit: 5,
          area: v.area,
        },
      })
    )
  );
}
