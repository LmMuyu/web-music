import request from "../../utils/request";

export function getCatlist(catlist: string[]) {
  return Promise.all(
    catlist.map((v) =>
      request({
        url: "/top/playlist",
        params: {
          order: "new",
          cat: v,
          limit: 10,
        },
      })
    )
  );
}
