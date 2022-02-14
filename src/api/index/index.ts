import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

export function getBanner(config: AxiosRequestConfig) {
  return request(config);
}

export function topSong() {
  return request({
    url: "/top/song",
    params: {
      type: 0,
    },
  });
}

export function getCatList(config: AxiosRequestConfig) {
  return request(config);
}

export function getHot(config: AxiosRequestConfig) {
  return request(config);
}

export async function getNewDisc(config: AxiosRequestConfig) {
  const reslut = await request(config);
  const res = (reslut.data.monthData as []).slice(0, 20);
  const list: Record<string, any>[] = [];

  for (let i = 0; i < res.length; i += 5) {
    list.push(res.slice(i, i + 5));
  }
  return list;
}

interface subItem {
  name: string;
}

export function getPlayList() {
  let catlist: string[];

  return async function (config?: AxiosRequestConfig) {
    if (!catlist) {
      const { data } = await getCatList({
        url: "/playlist/catlist",
      });

      catlist = (data.sub as []).map((sub: subItem) => sub.name);
      catlist.unshift("全部");
    }

    return request({
      ...config,
      params: {
        order: "hot",
        cat: catlist[0],
        limit: config?.params?.limit || 8,
      },
    });
  };
}

export function getCatlist(catlist: Array<{ tagName: string; area: string }>, limit: number) {
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

type listTime = number[];

export async function getTopList(config: AxiosRequestConfig) {
  const {
    data: { list },
  } = await request(config);

  const options: listTime = [];
  let index = 4;

  while ((index -= 1)) {
    options.push(list[index - 1]?.id);
  }

  return await Promise.all(
    options.reverse().map((id) =>
      request({
        url: "/playlist/detail",
        method: "GET",
        params: {
          id,
        },
      })
    )
  );
}

export function getRecommend(limit: number = 4) {
  return request({
    url: "/personalized",
    params: {
      limit,
    },
  });
}

export function recentlyAlbum() {
  return request({
    url: "/album/newest",
  });
}

export function artistList() {
  return request({
    url: "/artist/list",
  });
}
