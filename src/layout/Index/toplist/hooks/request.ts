import dayjs from "dayjs";

import { listDetail } from "../../../../api/toplist";
import LRU from "../../../../utils/LRUCache";

import type { ListItem } from "../types/requestType";

const LRUCache = new LRU(4);

export async function getTopListDetailData(id: number): Promise<ListItem> {
  const lruData = LRUCache.get(id);
  if (lruData) return lruData.value;

  let cardItem = (await listDetail(id)).data;
  const playlist = cardItem.playlist;

  const listItem: ListItem = {
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks,
    shareCount: playlist.shareCount,
    commentCount: playlist.commentCount,
    trackUpdateTime: transformDate(playlist.trackUpdateTime),
  };

  LRUCache.put(listItem.id, listItem);
  cardItem = null;

  return listItem;
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
