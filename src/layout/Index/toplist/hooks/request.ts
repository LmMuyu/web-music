import { Ref } from "@vue/reactivity";
import { toplistData, listDetail } from "../../../../api/toplist";
import type { ListTitle } from "../types/dataType";
import type { ListItem, TrackUpdateTimeObj } from "../types/requestType";
import dayDate from "dayjs";
import type {} from "dayjs";

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
  const result = await listDetail(id);
  const playlist: ListItem & { trackUpdateTime: number } = result.data.playlist;
  const map = mapRef.value;

  const listItem: ListItem = {
    select: true,
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks,
    shareCount: playlist.shareCount,
    commentCount: playlist.commentCount,
    trackUpdateTime: transformDate(playlist.trackUpdateTime),
  };

  return setMapList(listItem, map);
}

function setMapList(listItem: ListItem, mapRef: Map<number, ListItem[]>) {
  const id = listItem.id;

  if (mapRef.has(id)) {
    return mapRef.get(id);
  } else {
    return mapRef.set(id, [listItem]).get(id);
  }
}

function transformDate(time: number) {
  const trantime = dayDate(time);
  return (trantime as unknown) as TrackUpdateTimeObj;
}
