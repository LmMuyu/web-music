import { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

export async function getNewDisc(config: AxiosRequestConfig) {
  const reslut = await request(config);
  const res = (reslut.data.monthData as []).slice(0, 20);
  const list: Record<string, any>[] = [];

  for (let i = 0; i < res.length; i += 5) {
    list.push(res.slice(i, i + 5));
  }
  return list;
}
