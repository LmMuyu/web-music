import type { MatchItem } from "../type";

export function conversionPlayTime(matchItem: MatchItem) {
  const timeArr = matchItem.playTime.split(":");

  return {
    lycnode: matchItem.lyc,
    playItem: Number(timeArr[0]) * 60 + Number(timeArr[1]),
  };
}
