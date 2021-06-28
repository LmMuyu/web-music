import { Ref } from "@vue/reactivity";
import dayDate from "dayjs";

import { toplistData, listDetail } from "../../../../api/toplist";

import type { ListItem, TrackUpdateTimeObj } from "../types/requestType";
import type { ListTitle } from "../types/dataType";

type MapObj = Ref<Map<number, ListItem[]>>;

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

export async function getlistDetailData(id: number, mapRef: MapObj) {
  const listDetailRes = setMapList({ id }, mapRef.value, false);
  if (listDetailRes) return listDetailRes;

  const result = await listDetail(id);
  const playlist: ListItem & { trackUpdateTime: number } = result.data.playlist;
  const map = mapRef.value;

  const listItem: ListItem = {
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks,
    shareCount: playlist.shareCount,
    commentCount: playlist.commentCount,
    trackUpdateTime: transformDate(playlist.trackUpdateTime),
  };

  return setMapList(listItem, map);
}

function setMapList(
  listItem: ListItem | { id: number },
  mapRef: Map<number, ListItem[]>,
  isSet: true | false = true
) {
  const id = listItem.id;

  return mapRef.has(id)
    ? mapRef.get(id)
    : isSet
    ? // @ts-ignore
      mapRef.set(id, [listItem]).get(id)
    : undefined;
}

function transformDate(time: number) {
  const trantime = dayDate(time);
  return trantime as unknown as TrackUpdateTimeObj;
}
