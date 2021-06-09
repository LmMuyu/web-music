import { getCatlist } from "../../../../api/discover";
import { discoverMusic } from "./bannerFilter";

export async function getPlaylist() {
  return await getCatlist(discoverMusic);
}
