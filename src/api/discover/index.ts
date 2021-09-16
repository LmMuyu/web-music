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

export function recommendMV() {
  return request({
    url: "/mv/first",
    params: {
      limit: 15,
    },
  });
}

export function getArtists() {
  return request({
    url: "/top/artists",
    params: {
      limit: 10,
    },
  });
}
