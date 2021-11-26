import dayjs from "dayjs";

import LRU, { NodeAttribute } from "../../../../utils/LRUCache";
import { listDetail } from "../../../../api/toplist";
import { isType } from "../../../../utils/methods";

import type { ListItem } from "../types/requestType";

const LRUCache = new LRU(4);

export async function getlistDetailData(ids: number[]): Promise<NodeAttribute[]> {
  const lists = ids.map((key) => LRUCache.get(key));
  ids = ids.filter((key, index) => lists[index] === null);

  if (ids.length === 0) return lists;

  const listCard = await async_pool(ids, listDetail);

  const listCards = [...lists, ...listCard]
    .filter((catchdata) => !(isType(catchdata) === "Null"))
    .map((data) => {
      const playlist = data.data.playlist;

      const listItem: ListItem = {
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks,
        shareCount: playlist.shareCount,
        commentCount: playlist.commentCount,
        trackUpdateTime: transformDate(playlist.trackUpdateTime),
      };

      LRUCache.put(listItem.id, listItem);
      return listItem;
    }) as unknown as NodeAttribute[];

  return listCards;
}

function transformDate(time: number) {
  return dayjs(time).format("YYYY-MM-DD hh-mm-ss");
}

async function async_pool(asynclist: any[], iteratorFn, poolmax = 3) {
  const ret = [];
  const executing = [];

  for (const arg of asynclist) {
    const p = Promise.resolve().then(() => iteratorFn(arg));
    ret.push(p);

    if (poolmax <= asynclist.length) {
      const e = p.then((res) => executing.splice(executing.indexOf(res), 1));
      executing.push(e);

      if (executing.length >= poolmax) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(ret);
}
