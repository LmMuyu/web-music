import { getCatlist } from "../../../../api/discover";
import { discoverMusic } from "./data";

export async function getPlaylist(limit: number = 5) {
  return await getCatlist(discoverMusic, limit);
}
