import type { MusicDetailOption } from "../../../../../utils/musicDetail";
import musicDetail from "../../../../../utils/musicDetail";
import store from "../../../../../store";
import getRouter from "../../../../../utils/getRouter";

export function onSelectAll() {}

export function musicDetails(
  musicItem: Record<string, any>,
  path: string,
  id: number
) {
  const music = new musicDetail({ ...musicItem.al, ar: musicItem.ar[0] });
  store.commit("setMusicInfo", music);
  
  getRouter().push({ path, params: { id } });
}
