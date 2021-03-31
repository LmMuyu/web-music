import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";
import { getCatList } from "./getCatList";

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
