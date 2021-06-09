import { getCatlist } from "../../../../api/discover";
import { discoverMusic } from "./data";

export async function getPlaylist() {
  return await getCatlist(discoverMusic);
}
