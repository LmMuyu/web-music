import dayDate from "dayjs";

import LRUCache from "../../../../utils/LRUCache";
import { toplistData, listDetail } from "../../../../api/toplist";

import type { ListItem, TrackUpdateTimeObj } from "../types/requestType";
import type { ListTitle } from "../types/dataType";

export async function allToplist() {
  const { data } = await toplistData();
  let listTitle: ListTitle = {
    cloud: {
      title: "",
      childrenData: [...data.list.slice(0, 4)],
    },
    global: {
      title: "",
      childrenData: [...data.list.slice(4)],
    },
  };

  return listTitle;
}

export async function getlistDetailData(id: number) {
  const res = LRUCache.get(id);
  if (res !== -1) return [res];

  const result = await listDetail(id);
  const playlist: ListItem & { trackUpdateTime: number } = result.data.playlist;

  const listItem: ListItem = {
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks,
    shareCount: playlist.shareCount,
    commentCount: playlist.commentCount,
    trackUpdateTime: transformDate(playlist.trackUpdateTime),
  };

  LRUCache.put(id, listItem);
  return [listItem];
}

function transformDate(time: number) {
  const trantime = dayDate(time);
  return trantime as unknown as TrackUpdateTimeObj;
}
